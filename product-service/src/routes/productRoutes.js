const express = require("express");

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
} = require("../controllers/productController");

const { productValidation, validate } = require("../middleware/validate");
const upload = require("../middleware/upload");

const router = express.Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Lấy danh sách sản phẩm
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số sản phẩm mỗi trang
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm kiếm theo tên sản phẩm
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Lọc theo slug danh mục
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Giá thấp nhất
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Giá cao nhất
 *       - in: query
 *         name: inStock
 *         schema:
 *           type: boolean
 *         description: Chỉ lấy sản phẩm còn hàng
 *     responses:
 *       200:
 *         description: Lấy danh sách sản phẩm thành công
 */
router.get("/", getProducts);

router.post("/:id/image", upload.single("image"), uploadProductImage);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Lấy thông tin sản phẩm theo ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID sản phẩm
 *     responses:
 *       200:
 *         description: Lấy sản phẩm thành công
 *       404:
 *         description: Không tìm thấy sản phẩm
 */
router.get("/:id", getProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Tạo sản phẩm mới
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: Phở bò
 *               price:
 *                 type: number
 *                 example: 50000
 *               description:
 *                 type: string
 *                 example: Phở bò truyền thống
 *               stock:
 *                 type: integer
 *                 example: 10
 *               imageUrl:
 *                 type: string
 *                 example: https://example.com/pho-bo.jpg
 *               categoryId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Tạo sản phẩm thành công
 *       422:
 *         description: Dữ liệu không hợp lệ
 */
router.post("/", productValidation, validate, createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Cập nhật sản phẩm
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID sản phẩm
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               stock:
 *                 type: integer
 *               imageUrl:
 *                 type: string
 *               categoryId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cập nhật sản phẩm thành công
 *       404:
 *         description: Không tìm thấy sản phẩm
 */
router.put("/:id", updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Ẩn sản phẩm
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID sản phẩm
 *     responses:
 *       200:
 *         description: Ẩn sản phẩm thành công
 *       404:
 *         description: Không tìm thấy sản phẩm
 */
router.delete("/:id", deleteProduct);

module.exports = router;