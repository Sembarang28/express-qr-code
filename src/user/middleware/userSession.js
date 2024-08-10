const jwt = require("jsonwebtoken");
const prisma = require("../../config/db");
const response = require("../../config/response");

async function userPermission(req, res, next) {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_KEY);

      if (!decoded) {
        const responseBody = {
          status: false,
          message: "Not authorize",
          code: 401,
        };

        return response(res, responseBody);
      }

      const user = await prisma.accessToken.findUnique({
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

      if (user.user.role !== "user") {
        const responseBody = {
          status: false,
          message: "Forbidden",
          code: 403,
        };

        return response(res, responseBody);
      }

      req.user = {
        id: user.userId,
      };

      return next();
    } else {
      const responseBody = {
        status: false,
        message: "No token. Not authorize",
        code: 401,
      };

      return response(res, responseBody);
    }
  } catch (error) {
    console.log("userSession module Error: ", error);

    return {
      status: false,
      message: "Internal Server Error",
      code: 500,
    };
  }
}

module.exports = userPermission;
