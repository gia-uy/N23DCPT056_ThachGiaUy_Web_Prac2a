const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../utils/prisma");

const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ email, password và name",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email đã được đăng ký",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
      },
    });

    return res.status(201).json({
      message: "Đăng ký thành công",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Vui lòng nhập email và password",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        message: "Email hoặc password không đúng",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Email hoặc password không đúng",
      });
    }

    const accessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    const refreshToken = jwt.sign(
      {
        userId: user.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return res.status(200).json({
      message: "Đăng nhập thành công",
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        message: "Thiếu refreshToken",
      });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET
    );

    const user = await prisma.user.findFirst({
      where: {
        id: decoded.userId,
        refreshToken: refreshToken,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Refresh token không hợp lệ",
      });
    }

    const newAccessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    return res.status(200).json({
      message: "Refresh access token thành công",
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error);

    return res.status(401).json({
      message: "Refresh token không hợp lệ hoặc đã hết hạn",
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.userId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy user",
      });
    }

    return res.status(200).json({
      message: "Lấy thông tin user thành công",
      user,
    });
  } catch (error) {
    console.error("Get me error:", error);

    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};

module.exports = {
  register,
  login,
  refreshAccessToken,
  getMe,
};

