const Order = require("../models/Order");

// POST /api/orders
// Tạo đơn hàng mới
const createOrder = async (req, res, next) => {
  try {
    const {
      customerId,
      customerName,
      customerEmail,
      items,
      shippingAddress,
      note,
    } = req.body;

    // Tính subtotal cho từng sản phẩm
    const processedItems = items.map((item) => ({
      ...item,
      subtotal: item.price * item.quantity,
    }));

    // Tính tổng tiền đơn hàng
    const totalAmount = processedItems.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );

    const order = await Order.create({
      customerId,
      customerName,
      customerEmail,
      items: processedItems,
      totalAmount,
      shippingAddress,
      note,
    });

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/customer/:customerId
// Lấy danh sách đơn hàng của customer
const getOrdersByCustomer = async (req, res, next) => {
  try {
    const { customerId } = req.params;

    const {
      page = 1,
      limit = 10,
      status,
    } = req.query;

    const skip =
      (parseInt(page) - 1) * parseInt(limit);

    const filter = {
      customerId: parseInt(customerId),
    };

    if (status) {
      filter.status = status;
    }

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),

      Order.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(
          total / parseInt(limit)
        ),
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/:id
// Lấy chi tiết đơn hàng
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/orders/:id/status
// Cập nhật trạng thái đơn hàng
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    res.json({
      success: true,
      data: order,
      message: "Cập nhật trạng thái thành công",
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/orders/:id
// Hủy đơn hàng
const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    res.json({
      success: true,
      data: order,
      message: "Đã hủy đơn hàng",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrdersByCustomer,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
};