const express = require("express");

const {
  createOrder,
  getOrdersByCustomer,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} = require("../controllers/orderController");

const router = express.Router();

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Tạo đơn hàng mới
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderInput'
 *     responses:
 *       201:
 *         description: Tạo đơn hàng thành công
 *       500:
 *         description: Lỗi server
 */
router.post("/", createOrder);

/**
 * @swagger
 * /api/orders/customer/{customerId}:
 *   get:
 *     summary: Lấy danh sách đơn hàng của khách hàng
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum:
 *             - pending
 *             - confirmed
 *             - shipping
 *             - delivered
 *             - cancelled
 *     responses:
 *       200:
 *         description: Danh sách đơn hàng
 */
router.get("/customer/:customerId", getOrdersByCustomer);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Lấy thông tin một đơn hàng
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin đơn hàng
 *       404:
 *         description: Không tìm thấy đơn hàng
 */
router.get("/:id", getOrderById);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Cập nhật trạng thái đơn hàng
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - pending
 *                   - confirmed
 *                   - shipping
 *                   - delivered
 *                   - cancelled
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thành công
 *       404:
 *         description: Không tìm thấy đơn hàng
 */
router.put("/:id/status", updateOrderStatus);

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Hủy đơn hàng
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Hủy đơn hàng thành công
 *       404:
 *         description: Không tìm thấy đơn hàng
 */
router.delete("/:id", cancelOrder);

module.exports = router;