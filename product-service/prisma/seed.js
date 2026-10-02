const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // =========================
  // 1. Tạo danh mục
  // =========================
  const categories = [
    {
      name: "Món chính",
      slug: "mon-chinh",
      description: "Các món ăn chính",
    },
    {
      name: "Đồ ăn nhanh",
      slug: "do-an-nhanh",
      description: "Các món ăn nhanh và tiện lợi",
    },
    {
      name: "Đồ uống",
      slug: "do-uong",
      description: "Các loại đồ uống",
    },
    {
      name: "Tráng miệng",
      slug: "trang-mieng",
      description: "Các món ăn tráng miệng",
    },
  ];

  const categoryMap = {};

  for (const category of categories) {
    const createdCategory = await prisma.category.upsert({
      where: {
        slug: category.slug,
      },
      update: {
        name: category.name,
        description: category.description,
      },
      create: category,
    });

    categoryMap[category.slug] = createdCategory;
  }

  console.log("✅ Categories created");

  // =========================
  // 2. Tạo sản phẩm
  // =========================
  const products = [
    {
      name: "Cơm gà xối mỡ",
      slug: "com-ga-xoi-mo",
      description: "Cơm gà chiên giòn ăn kèm nước sốt đặc biệt",
      price: "45000",
      stock: 20,
      imageUrl: null,
      isActive: true,
      categoryId: categoryMap["mon-chinh"].id,
    },
    {
      name: "Mì xào bò",
      slug: "mi-xao-bo",
      description: "Mì xào cùng thịt bò và rau củ",
      price: "50000",
      stock: 15,
      imageUrl: null,
      isActive: true,
      categoryId: categoryMap["mon-chinh"].id,
    },
    {
      name: "Bún thịt nướng",
      slug: "bun-thit-nuong",
      description: "Bún thịt nướng kèm rau sống và nước mắm",
      price: "40000",
      stock: 18,
      imageUrl: null,
      isActive: true,
      categoryId: categoryMap["mon-chinh"].id,
    },

    {
      name: "Hamburger bò",
      slug: "hamburger-bo",
      description: "Hamburger bò kèm rau và sốt đặc biệt",
      price: "55000",
      stock: 12,
      imageUrl: null,
      isActive: true,
      categoryId: categoryMap["do-an-nhanh"].id,
    },
    {
      name: "Khoai tây chiên",
      slug: "khoai-tay-chien",
      description: "Khoai tây chiên giòn",
      price: "25000",
      stock: 30,
      imageUrl: null,
      isActive: true,
      categoryId: categoryMap["do-an-nhanh"].id,
    },
    {
      name: "Gà rán",
      slug: "ga-ran",
      description: "Gà rán giòn với lớp vỏ vàng thơm",
      price: "35000",
      stock: 0,
      imageUrl: null,
      isActive: true,
      categoryId: categoryMap["do-an-nhanh"].id,
    },

    {
      name: "Trà đào",
      slug: "tra-dao",
      description: "Trà đào thanh mát",
      price: "30000",
      stock: 25,
      imageUrl: null,
      isActive: true,
      categoryId: categoryMap["do-uong"].id,
    },
    {
      name: "Trà sữa trân châu",
      slug: "tra-sua-tran-chau",
      description: "Trà sữa kết hợp trân châu đen",
      price: "35000",
      stock: 20,
      imageUrl: null,
      isActive: true,
      categoryId: categoryMap["do-uong"].id,
    },
    {
      name: "Nước cam",
      slug: "nuoc-cam",
      description: "Nước cam tươi",
      price: "25000",
      stock: 10,
      imageUrl: null,
      isActive: true,
      categoryId: categoryMap["do-uong"].id,
    },

    {
      name: "Chè khúc bạch",
      slug: "che-khuc-bach",
      description: "Chè khúc bạch thanh mát với trái cây",
      price: "30000",
      stock: 8,
      imageUrl: null,
      isActive: true,
      categoryId: categoryMap["trang-mieng"].id,
    },
    {
      name: "Bánh flan",
      slug: "banh-flan",
      description: "Bánh flan mềm mịn với caramel",
      price: "20000",
      stock: 15,
      imageUrl: null,
      isActive: true,
      categoryId: categoryMap["trang-mieng"].id,
    },
    {
      name: "Kem vani",
      slug: "kem-vani",
      description: "Kem vani mát lạnh",
      price: "22000",
      stock: 0,
      imageUrl: null,
      isActive: false,
      categoryId: categoryMap["trang-mieng"].id,
    },
  ];

  // =========================
  // 3. Insert / cập nhật sản phẩm
  // =========================
  for (const product of products) {
    await prisma.product.upsert({
      where: {
        slug: product.slug,
      },
      update: {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        imageUrl: product.imageUrl,
        isActive: product.isActive,
        categoryId: product.categoryId,
      },
      create: product,
    });
  }

  console.log("✅ Products created");
  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });