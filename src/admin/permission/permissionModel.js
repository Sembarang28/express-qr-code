const prisma = require("../../config/db");
const fs = require("fs");

class AdminPermissionModel {
  async createPermission(reqData, photo) {
    try {
      const createPermission = await prisma.permission.create({
        data: {
          userId: Number(reqData.userId),
          permission: reqData.permission,
          information: reqData.information,
          photo,
          verify: "Diajukan",
        },
      });

      return {
        status: true,
        message: "Izin bekerja berhasil diajukan",
        code: 201,
      };
    } catch (error) {
      console.error("createPermission module error: ", error);
      return {
        status: false,
        message: error.message,
        code: 500,
      };
    }
  }

  async readAllPermission(search) {
    try {
      const readAllPermission = await prisma.permission.findMany({
        where: {
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
      });

      const permissionData = [];

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
        data: permissionData,
      };
    } catch (error) {
      console.error("readAllPermission module error: ", error);
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

      delete permissionData.user;
      delete permissionData.createdAt;

      return {
        status: true,
        message: "Data berhasil ditemukan",
        code: 200,
        data: permissionData,
      };
    } catch (error) {
      console.error("readPermissionById module error: ", error);
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
      const readPermissionById = await prisma.permission.findUnique({
        where: {
          id,
        },
      });

      if (photo) {
        const oldPhoto = readPermissionById.photo;
        photoUrl = photo;
        oldPhoto ? fs.unlinkSync(oldPhoto) : null;
      } else {
        photoUrl = readPermissionById.photo;
      }

      const updatePermissionById = await prisma.permission.update({
        where: {
          id,
        },
        data: {
          userId: Number(reqData.userId),
          permission: reqData.permission,
          information: reqData.information,
          photo: photoUrl,
          verify: reqData.verify,
        },
      });

      return {
        status: true,
        message: "Data berhasil diubah",
        code: 200,
      };
    } catch (error) {
      console.error("updatePermissionById module error: ", error);
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

      if (deletePermissionById.photo) {
        fs.unlinkSync(deletePermissionById.photo);
      }

      return {
        status: true,
        message: "Data berhasil dihapus",
        code: 200,
      };
    } catch (error) {
      console.error("deletePermissionById module error: ", error);
      return {
        status: false,
        message: error.message,
        code: 500,
      };
    }
  }
}

module.exports = new AdminPermissionModel();
