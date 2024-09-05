const prisma = require("../../config/db");
const fs = require("fs");
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");

class UserProfileModel {
  async generateQRCode(id) {
    try {
      const qrCode = nanoid(20);

      const updateQrId = await prisma.user.update({
        where: {
          id,
        },
        data: {
          qrCode,
        },
      });

      return {
        status: true,
        message: "QR berhasil dibuat",
        code: 201,
        data: qrCode,
      };
    } catch (error) {
      console.error("generateQRId module error, ", error);
      return {
        status: false,
        message: error.message,
        code: 500,
      };
    }
  }

  async readUserProfile(id) {
    try {
      const readUserById = await prisma.user.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          nip: true,
          employeeStatus: true,
          role: true,
          photo: true,
        },
      });

      return {
        status: true,
        message: `Profile berhasil ditemukan`,
        code: 200,
        data: readUserById,
      };
    } catch (error) {
      console.error("readUserProfile module error, ", error);
      return {
        status: false,
        message: error.message,
        code: 500,
      };
    }
  }

  async updateUserProfile(id, reqData, photo) {
    try {
      let photoUrl = "";
      const readUserAccountById = await prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (photo) {
        const oldPhoto = readUserAccountById.photo;
        photoUrl = photo;
        oldPhoto ? fs.unlinkSync(oldPhoto) : null;
      } else {
        photoUrl = readUserAccountById.photo;
      }

      const updateUserAccountById = await prisma.user.update({
        where: {
          id,
        },
        data: {
          name: reqData.name,
          email: reqData.email,
          nip: reqData.nip,
          employeeStatus: reqData.employeeStatus,
          photo: photoUrl,
        },
      });

      return {
        status: true,
        message: `Profile berhasil diubah`,
        code: 200,
      };
    } catch (error) {
      console.error("updateUserProfile module error, ", error);
      return {
        status: false,
        message: error.message,
        code: 500,
      };
    }
  }

  async updateUserPassword(id, reqData) {
    try {
      const readUserAccountById = await prisma.user.findUnique({
        where: {
          id,
        },
        select: {
          email: true,
          password: true,
        },
      });

      if (
        !bcrypt.compareSync(reqData.oldPassword, readUserAccountById.password)
      ) {
        return {
          status: false,
          message: "Password lama tidak sama!",
          code: 400,
        };
      }

      const password = bcrypt.hashSync(reqData.newPassword, 12);

      const updateUserPasswordById = await prisma.user.update({
        where: {
          id,
        },
        data: {
          password,
        },
      });

      return {
        status: true,
        message: "Password berhasil diubah",
        code: 200,
      };
    } catch (error) {
      console.error("updateUserPassword module error: ", error);
      return {
        status: false,
        message: error.message,
        code: 500,
      };
    }
  }
}

module.exports = new UserProfileModel();
