const { body, validationResult } = require("express-validator");

const productValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Tên sản phẩm là bắt buộc"),

  body("price")
    .isFloat({ min: 0 })
    .withMessage("Giá phải là số và lớn hơn hoặc bằng 0"),

  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Số lượng tồn kho phải là số nguyên không âm"),

  body("categoryId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("categoryId phải là số nguyên dương"),
];

function validate(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      errors: errors.array(),
    });
  }

  next();
}

module.exports = {
  validate,
  productValidation,
};