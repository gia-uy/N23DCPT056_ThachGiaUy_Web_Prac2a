const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Order Service API",
      version: "1.0.0",
      description: "API quản lý đơn hàng",
    },

    servers: [
      {
        url: "http://localhost:3002",
        description: "Local server",
      },
    ],

    tags: [
      {
        name: "Orders",
        description: "Các API quản lý đơn hàng",
      },
    ],

    security: [
      {
        bearerAuth: [],
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      schemas: {
        OrderItem: {
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

            subtotal: {
              type: "number",
              example: 90000,
            },
          },
        },

        ShippingAddress: {
          type: "object",
          properties: {
            street: {
              type: "string",
              example: "123 Đường Nguyễn Trãi",
            },

            ward: {
              type: "string",
              example: "Phường Bến Thành",
            },

            district: {
              type: "string",
              example: "Quận 1",
            },

            city: {
              type: "string",
              example: "TP. Hồ Chí Minh",
            },
          },
        },

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
              format: "email",
              example: "nguyenvana@example.com",
            },

            items: {
              type: "array",
              items: {
                $ref: "#/components/schemas/OrderItem",
              },
            },

            shippingAddress: {
              $ref: "#/components/schemas/ShippingAddress",
            },

            note: {
              type: "string",
              example: "Giao hàng buổi tối",
            },
          },
        },

        Order: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "68e0abc123456789abcdef12",
            },

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
              format: "email",
              example: "nguyenvana@example.com",
            },

            items: {
              type: "array",
              items: {
                $ref: "#/components/schemas/OrderItem",
              },
            },

            totalAmount: {
              type: "number",
              example: 90000,
            },

            shippingAddress: {
              $ref: "#/components/schemas/ShippingAddress",
            },

            note: {
              type: "string",
              example: "Giao hàng buổi tối",
            },

            status: {
              type: "string",
              enum: [
                "pending",
                "confirmed",
                "shipping",
                "delivered",
                "cancelled",
              ],
              example: "pending",
            },
          },
        },
      },
    },
  },

  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;