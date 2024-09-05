const jwt = require("jsonwebtoken");
const prisma = require("../../config/db");
const response = require("../../config/response");

async function adminSession(req, res, next) {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const admin = await prisma.accessToken.findUnique({
        where: {
          id: decoded.id,
        },
        select: {
          userId: true,
          user: {
            select: {
              role: true,
            },
          },
        },
      });

      if (admin.user.role !== "admin") {
        const responseBody = {
          status: false,
          message: "Forbidden",
          code: 403,
        };

        return response(res, responseBody);
      }

      req.user = {
        id: admin.userId,
      };

      return next();
    } else {
      const responseBody = {
        status: false,
        message: "Tidak ada token",
        code: 401,
      };

      return response(res, responseBody);
    }
  } catch (error) {
    console.error("adminSession module error: ", error);
    const responseBody = {
      status: false,
      message: "Sesi telah berakhir, silahkan login ulang",
      code: 401,
    };

    response(res, responseBody);
  }
}

module.exports = adminSession;
