const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Order Service API",
      version: "1.0.0",
      description: "API quản lý đơn hàng",
    },

    components: {
      schemas: {
        OrderInput: {
          type: "object",
          required: [
            "customerId",
            "customerName",
            "customerEmail",
            "items",
          ],
          properties: {
            customerId: {
              type: "integer",
              example: 1,
            },

            customerName: {
              type: "string",
              example: "Nguyễn Văn A",
            },

            customerEmail: {
              type: "string",
              example: "nguyenvana@example.com",
            },

            items: {
              type: "array",
              items: {
                type: "object",
                required: [
                  "productId",
                  "productName",
                  "price",
                  "quantity",
                ],
                properties: {
                  productId: {
                    type: "integer",
                    example: 1,
                  },

                  productName: {
                    type: "string",
                    example: "Phở bò",
                  },

                  price: {
                    type: "number",
                    example: 45000,
                  },

                  quantity: {
                    type: "integer",
                    example: 2,
                  },
                },
              },
            },

            shippingAddress: {
              type: "object",
              properties: {
                street: {
                  type: "string",
                  example: "123 Đường ABC",
                },

                city: {
                  type: "string",
                  example: "Hồ Chí Minh",
                },

                district: {
                  type: "string",
                  example: "Quận 1",
                },
              },
            },

            note: {
              type: "string",
              example: "Giao hàng giờ hành chính",
            },
          },
        },
      },
    },

    servers: [
      {
        url: "http://localhost:3002",
        description: "Local server",
      },
    ],
  },

  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;