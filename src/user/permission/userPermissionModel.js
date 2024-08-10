const {
  deletePermissionById,
} = require("../../admin/permission/permissionModel");
const prisma = require("../../config/db");
const fs = require("fs");

class UserPermissionModel {
  async createPermission(userId, reqData, photo) {
    try {
      const createPermission = await prisma.permission.create({
        data: {
          userId,
          permission: reqData.permission,
          information: reqData.information,
          photo,
          verify: "Diajukan",
        },
      });

      return {
        status: true,
        message: "Izin kerja berhasil diajukan",
        code: 201,
      };
    } catch (error) {
      console.log("createPermission module error: ", error);
      return {
        status: false,
        message: error.message,
        code: 500,
      };
    }
  }

  async readAllPermission(userId, page, search) {
    try {
      const countPermission = await prisma.permission.count({
        where: {
          userId,
          user: {
            name: { contains: search, mode: "insensitive" },
          },
        },
      });

      const totalPages = Math.ceil(countPermission / 15);
      const offset = (page - 1) * 15;

      const readAllPermission = await prisma.permission.findMany({
        where: {
          userId,
          user: {
            name: { contains: search, mode: "insensitive" },
          },
        },
        select: {
          id: true,
          userId: true,
          user: {
            select: {
              name: true,
            },
          },
          photo: true,
          permission: true,
          information: true,
          verify: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 15,
        skip: offset,
      });

      let permissionData = [];

      for (const permission of readAllPermission) {
        const object = {
          ...permission,
          name: permission.user.name,
          date: permission.createdAt.toISOString().split("T")[0],
        };

        delete object.user;
        delete object.createdAt;
        permissionData.push(object);
      }

      return {
        status: true,
        message: "Data berhasil ditemukan",
        code: 200,
        data: {
          permission: permissionData,
          totalPages,
        },
      };
    } catch (error) {
      console.log("readAllPermission module error: ", error);
      return {
        status: false,
        message: error.message,
        code: 500,
      };
    }
  }

  async readPermissionById(id) {
    try {
      const readPermissionById = await prisma.permission.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          userId: true,
          user: {
            select: {
              name: true,
            },
          },
          photo: true,
          permission: true,
          information: true,
          verify: true,
          createdAt: true,
        },
      });

      const permissionData = {
        ...readPermissionById,
        name: readPermissionById.user.name,
        date: readPermissionById.createdAt.toISOString().split("T")[0],
      };

      return {
        status: true,
        message: "Data berhasil ditemukan",
        code: 200,
        data: permissionData,
      };
    } catch (error) {
      console.log("readPermissionById module error: ", error);
      return {
        status: false,
        message: error.message,
        code: 500,
      };
    }
  }

  async updatePermissionById(id, reqData, photo) {
    try {
      let photoUrl = "";
      const readPermissionById = await this.readPermissionById(id);

      if (photo) {
        const oldPhoto = readPermissionById.data.photo;
        photoUrl = photo;
        oldPhoto ? fs.unlinkSync(oldPhoto) : null;
      } else {
        photoUrl = readPermissionById.data.photo;
      }

      const updatePermissionById = await prisma.permission.update({
        where: {
          id,
        },
        data: {
          permission: reqData.permission,
          information: reqData.information,
          photo: photoUrl,
        },
      });

      return {
        status: true,
        message: "Data berhasil diubah",
        code: 200,
      };
    } catch (error) {
      console.log("updatePermissionById module error: ", error);
      return {
        status: false,
        message: error.message,
        code: 500,
      };
    }
  }

  async deletePermissionById(id) {
    try {
      const deletePermissionById = await prisma.permission.delete({
        where: {
          id,
        },
      });

      fs.unlinkSync(deletePermissionById.photo);

      return {
        status: true,
        message: "Data berhasil dihapus",
        code: 200,
      };
    } catch (error) {
      console.log("deletePermissionById module error: ", error);
      return {
        status: false,
        message: error.message,
        code: 500,
      };
    }
  }
}

module.exports = new UserPermissionModel();
