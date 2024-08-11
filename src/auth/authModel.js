const prisma = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const nodemailer = require("../config/nodemailer");

class AuthModel {
  async login(email, password) {
    try {
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
          qrCode: true,
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

      if (!bcrypt.compareSync(password, user.password)) {
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

        const expired = new Date(
          currentDate.getTime() + 7 * 24 * 60 * 60 * 1000,
        );

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
          qrCode: user.qrCode,
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

        const expired = new Date(
          currentDate.getTime() + 7 * 24 * 60 * 60 * 1000,
        );

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
          qrCode: user.qrCode,
          expiresIn: expired.toISOString(),
        };

        return {
          status: true,
          message: "Berhasil login",
          code: 200,
          data: resData,
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

        const expired = new Date(
          currentDate.getTime() + 7 * 24 * 60 * 60 * 1000,
        );

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
          qrCode: user.qrCode,
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
        qrCode: user.qrCode,
        expiresIn: user.accessToken.expired.toISOString(),
      };

      return {
        status: true,
        message: "Berhasil login",
        data: resData,
        code: 200,
      };
    } catch (error) {
      console.log("login module error", error);
      return {
        status: false,
        message: error.message,
        code: 500,
      };
    }
  }

  async forgotPassword(email) {
    try {
      const getOneUser = await prisma.user.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
          name: true,
          email: true,
          otp: {
            select: {
              id: true,
              userId: true,
              email: true,
              otp: true,
            },
          },
        },
      });

      if (!getOneUser) {
        return {
          status: false,
          message: "Email tidak ditemukan",
          code: 404,
        };
      }

      const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
      });

      const hashOtp = bcrypt.hashSync(otp, 12);

      if (!getOneUser.otp) {
        const createOtp = await prisma.oTP.create({
          data: {
            userId: getOneUser.id,
            email: getOneUser.email,
            otp: hashOtp,
          },
        });

        await nodemailer.sendNodeMailer(otp, email);

        return {
          status: true,
          message: "OTP Berhasil Dikirim",
          code: 200,
        };
      }

      const updateOtp = await prisma.oTP.update({
        where: {
          userId: getOneUser.id,
        },
        data: {
          userId: getOneUser.id,
          email: getOneUser.email,
          otp: hashOtp,
        },
      });

      await nodemailer.sendNodeMailer(otp, email);

      return {
        status: true,
        message: "OTP Berhasil Dikirim",
        code: 200,
      };
    } catch (error) {
      console.log("forgotPassword module error", error);
      return {
        status: false,
        message: error.message,
        code: 500,
      };
    }
  }

  async resetPassword(email, otp, password) {
    try {
      const getOTP = await prisma.oTP.findFirst({
        where: {
          user: {
            email,
          },
        },
        select: {
          id: true,
          userId: true,
          email: true,
          otp: true,
        },
      });

      if (!getOTP) {
        return {
          status: false,
          message: "Email Tidak Ditemukan",
          code: 404,
        };
      }

      if (!bcrypt.compareSync(otp, getOTP.otp)) {
        return {
          status: false,
          message: "OTP yang dimasukkan salah",
          code: 400,
        };
      }

      const hashPassword = bcrypt.hashSync(password, 12);

      const updatePassword = await prisma.user.update({
        where: {
          email,
        },
        data: {
          password: hashPassword,
        },
      });

      return {
        status: true,
        message: "Password berhasil diubah",
        code: 200,
      };
    } catch (error) {
      console.log("resetPassword module error", error);
      return {
        status: false,
        message: error.message,
        code: 500,
      };
    }
  }
}

module.exports = new AuthModel();
