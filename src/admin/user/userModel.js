const prisma = require("../../config/db");
const bcrypt = require("bcrypt");
const fs = require("fs");

class UserModel {
  async creatUser(reqData, photo) {
    try {
      const password = bcrypt.hashSync(reqData.password, 12);

      const createUser = await prisma.user.create({
        data: {
          name: reqData.name,
          email: reqData.email,
          password,
          nip: reqData.nip,
          employeeStatus: reqData.employeeStatus,
          role: reqData.role,
          photo,
        },
      });

      return {
        status: true,
        message: "User berhasil ditambahkan",
        code: 201,
      };
    } catch (error) {
      console.error("createUser module error, ", error);
      return {
        status: false,
        message: "Email telah digunakan!",
        code: 500,
      };
    }
  }

  async readAllUser(search) {
    try {
      const trimSearch = search.trim();
      console.log(search);
      const readAllUser = await prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: trimSearch, mode: "insensitive" } },
            { nip: { contains: trimSearch, mode: "insensitive" } },
            { employeeStatus: { contains: trimSearch, mode: "insensitive" } },
            { role: { contains: trimSearch, mode: "insensitive" } },
          ],
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
        skip: 1,
        orderBy: [
          {
            createdAt: "asc",
          },
          {
            name: "asc",
          },
        ],
      });

      return {
        status: true,
        message: "Data berhasil ditemukan",
        code: 200,
        data: readAllUser,
      };
    } catch (error) {
      console.error("readAllUser module error, ", error);
      return {
        status: false,
        message: error.message,
        code: 500,
      };
    }
  }

  async readUserById(id) {
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
        message: `Data user berhasil ditemukan`,
        code: 200,
        data: readUserById,
      };
    } catch (error) {
      console.error("readUserById module error, ", error);
      return {
        status: false,
        message: error.message,
        code: 500,
      };
    }
  }

  async updateUserAccountById(id, reqData, photo) {
    try {
      let photoUrl = "";
      const readUserAccountById = await this.readUserById(id);

      if (photo) {
        const oldPhoto = readUserAccountById.data.photo;
        photoUrl = photo;
        oldPhoto ? fs.unlinkSync(oldPhoto) : null;
      } else {
        photoUrl = readUserAccountById.data.photo;
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
          role: reqData.role,
          photo: photoUrl,
        },
      });

      return {
        status: true,
        message: `Data user berhasil diubah`,
        code: 200,
      };
    } catch (error) {
      console.error("updateUserById module error, ", error);
      return {
        status: false,
        message: "Email telah digunakan!",
        code: 500,
      };
    }
  }

  async updateUserPasswordById(id, reqData) {
    try {
      const password = bcrypt.hashSync(reqData.password, 12);

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
        message: `Password user berhasil diubah`,
        code: 200,
      };
    } catch (error) {
      console.error("updateUserPasswordById module error, ", error);
      return {
        status: false,
        message: error.message,
        code: 500,
      };
    }
  }

  async deleteUser(id) {
    try {
      const deleteUserAccountById = await prisma.user.delete({
        where: {
          id,
        },
      });

      if (deleteUserAccountById.photo) {
        fs.unlinkSync(deleteUserAccountById.photo);
      }

      return {
        status: true,
        message: `Data user berhasil dihapus`,
        code: 200,
      };
    } catch (error) {
      console.error("deleteUser module error, ", error);
      return {
        status: false,
        message: error.message,
        code: 500,
      };
    }
  }
}

module.exports = new UserModel();
