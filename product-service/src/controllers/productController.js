const prisma = require("../config/prisma");
const redis = require("../config/redis");

// Xóa toàn bộ cache danh sách sản phẩm
const clearProductCache = async () => {
  const keys = await redis.keys("products:*");

  if (keys.length > 0) {
    await redis.del(...keys);
  }
};


// GET /api/products
// Lấy danh sách sản phẩm có phân trang, lọc, sắp xếp

const getProducts = async (req, res, next) => {
  try {
    const cacheKey = `products:${JSON.stringify(req.query)}`;

    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    const {
      page = 1,
      limit = 10,
      search = "",
      category,
      sortBy = "createdAt",
      order = "desc",
      minPrice,
      maxPrice,
      inStock,
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      isActive: true,

      ...(search && {
        name: {
          contains: search,
          mode: "insensitive",
        },
      }),

      ...(category && {
        category: {
          slug: category,
        },
      }),

      ...(minPrice || maxPrice
        ? {
            price: {
              ...(minPrice && { gte: parseFloat(minPrice) }),
              ...(maxPrice && { lte: parseFloat(maxPrice) }),
            },
          }
        : {}),

      ...(inStock === "true" && {
        stock: {
          gt: 0,
        },
      }),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
        orderBy: {
          [sortBy]: order,
        },
        skip,
        take: parseInt(limit),
      }),

      prisma.product.count({
        where,
      }),
    ]);

    const result = {
      success: true,
      data: products,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    };

    await redis.setex(cacheKey, 300, JSON.stringify(result));

    res.json(result);
  } catch (error) {
    next(error);
  }
};


// GET /api/products/:id
// Lấy thông tin một sản phẩm theo ID

const getProductById = async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
      include: {
        category: true,
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};


// POST /api/products
// Tạo sản phẩm mới

const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      price,
      description,
      stock,
      imageUrl,
      categoryId,
    } = req.body;

    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        price,
        description,
        stock,
        imageUrl,
        categoryId,
      },
      include: {
        category: true,
      },
    });

    await clearProductCache();

    res.status(201).json({
      success: true,
      data: product,
      message: "Tạo sản phẩm thành công",
    });
  } catch (error) {
    next(error);
  }
};


// PUT /api/products/:id
// Cập nhật sản phẩm

const updateProduct = async (req, res, next) => {
  try {
    const product = await prisma.product.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: req.body,
      include: {
        category: true,
      },
    });

    await clearProductCache();

    res.json({
      success: true,
      data: product,
      message: "Cập nhật thành công",
    });
  } catch (error) {
    next(error);
  }
};


// DELETE /api/products/:id
// Xóa mềm sản phẩm

const deleteProduct = async (req, res, next) => {
  try {
    await prisma.product.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        isActive: false,
      },
    });

    await clearProductCache();

    res.json({
      success: true,
      message: "Đã ẩn sản phẩm thành công",
    });
  } catch (error) {
    next(error);
  }
};


// POST /api/products/:id/image
// Upload ảnh sản phẩm lên Cloudinary

const uploadProductImage = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng chọn ảnh",
      });
    }

    const product = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        imageUrl: req.file.path,
      },
      include: {
        category: true,
      },
    });


    await clearProductCache();

    res.json({
      success: true,
      data: product,
      message: "Upload ảnh sản phẩm thành công",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
};
