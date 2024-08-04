const prisma = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class AuthModel {
  async login(email, password) {
    const currentDate = new Date();

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        photo: true,
        role: true,
        nip: true,
        employeeStatus: true,
        accessToken: {
          select: {
            id: true,
            token: true,
            expired: true,
          },
        },
      },
    });

    if (!user) {
      return {
        status: false,
        message: "Email atau password salah",
        code: 401,
      };
    }

    if (bcrypt.compareSync(password, user.password)) {
      return {
        status: false,
        message: "Email atau password salah",
        code: 401,
      };
    }

    // Check token not exist
    if (!user.accessToken) {
      const saveAccessToken = await prisma.accessToken.create({
        data: {
          userId: user.id,
          token: "",
        },
      });

      const payload = {
        id: saveAccessToken.id,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      const expired = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);

      const updateAccessToken = await prisma.accessToken.update({
        where: {
          id: saveAccessToken.id,
        },
        data: {
          token,
          expired,
        },
      });

      const resData = {
        name: user.name,
        email: user.email,
        photo: user.photo,
        role: user.role,
        nip: user.nip,
        employeeStatus: user.employeeStatus,
        token,
        expiresIn: expired.toISOString(),
      };

      return {
        status: true,
        message: "Berhasil login",
        data: resData,
        code: 200,
      };
    }

    if (!user.accessToken.token) {
      const payload = {
        id: user.accessToken.id,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      const expired = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);

      const updateAccessToken = await prisma.accessToken.update({
        where: {
          id: payload.id,
        },
        data: {
          token,
          expired,
        },
      });

      const resData = {
        name: user.name,
        email: user.email,
        photo: user.photo,
        role: user.role,
        nip: user.nip,
        employeeStatus: user.employeeStatus,
        token,
        expiresIn: expired.toISOString(),
      };

      return {
        status: true,
        message: "Berhasil login",
        data: resData,
        code: 200,
      };
    }

    let token = user.accessToken.token;
    const decodedToken = jwt.decode(token);

    // Check token if expired
    if (decodedToken.exp * 1000 <= new Date().getTime()) {
      const payload = {
        id: user.accessToken.id,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      const expired = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);

      const updateAccessToken = await prisma.accessToken.update({
        where: {
          id: payload.id,
        },
        data: {
          token,
          expired,
        },
      });

      const resData = {
        name: user.name,
        email: user.email,
        photo: user.photo,
        role: user.role,
        nip: user.nip,
        employeeStatus: user.employeeStatus,
        token,
        expiresIn: expired.toISOString(),
      };

      return {
        status: true,
        message: "Berhasil login",
        data: resData,
        code: 200,
      };
    }

    const resData = {
      name: user.name,
      email: user.email,
      photo: user.photo,
      role: user.role,
      nip: user.nip,
      employeeStatus: user.employeeStatus,
      token: user.accessToken.token,
      expiresIn: user.accessToken.expired.toISOString(),
    };

    return {
      status: true,
      message: "Berhasil login",
      data: resData,
      code: 200,
    };
  }
}
