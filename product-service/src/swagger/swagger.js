const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Product Service API",
      version: "1.0.0",
      description: "API quản lý sản phẩm — Lab 2 Nâng cao",
      contact: {
        name: "Dev Team",
        email: "dev@example.com",
      },
    },

    servers: [
      {
        url: "http://localhost:3001",
        description: "Development",
      },
      {
        url: "https://product-service.railway.app",
        description: "Production",
      },
    ],

    components: {
      schemas: {
        Product: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            name: {
              type: "string",
              example: "Cơm gà xối mỡ",
            },
            price: {
              type: "number",
              example: 45000,
            },
            stock: {
              type: "integer",
              example: 20,
            },
            description: {
              type: "string",
              example: "Cơm gà chiên giòn ăn kèm nước sốt đặc biệt",
            },
            imageUrl: {
              type: "string",
              example: "https://example.com/image.jpg",
            },
            isActive: {
              type: "boolean",
              example: true,
            },
            category: {
              $ref: "#/components/schemas/Category",
            },
          },
        },

        Category: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            name: {
              type: "string",
              example: "Món chính",
            },
            slug: {
              type: "string",
              example: "mon-chinh",
            },
          },
        },

        PaginatedProducts: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
            },
            data: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Product",
              },
            },
            pagination: {
              type: "object",
              properties: {
                total: {
                  type: "integer",
                },
                page: {
                  type: "integer",
                },
                limit: {
                  type: "integer",
                },
                totalPages: {
                  type: "integer",
                },
              },
            },
          },
        },
      },
    },
  },

  // Tự động scan JSDoc comments từ các file route
  apis: ["./src/routes/*.js"],
};

module.exports = swaggerJsdoc(options);