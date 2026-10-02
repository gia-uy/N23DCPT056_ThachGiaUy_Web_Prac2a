require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger/swagger");

const connectDB = require("./config/database");
const orderRoutes = require("./routes/orderRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: process.env.SERVICE_NAME,
    uptime: process.uptime(),
  });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/orders", orderRoutes);

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3002;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Order Service running on port ${PORT}`);
  });
};

startServer();