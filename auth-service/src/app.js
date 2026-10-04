require("dotenv").config();
const express = require("express");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "auth-service",
  });
});

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});