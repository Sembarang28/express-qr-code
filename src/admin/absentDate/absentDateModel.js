const prisma = require("../../config/db");

class AdminAbsentDateModel {
  async createAbsentDate(reqData) {
    try {
      const date = new Date(reqData.date);
      date.setTime(date.getTime() + 8 * 60 * 60 * 1000);
      const createAbsentDate = await prisma.absentDate.create({
        data: {
          date,
          dayStatus: reqData.dayStatus,
          information: reqData.information,
        },
      });

      const readAllUser = await prisma.user.findMany({
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

      const absentData = readAllUser.map((user) => ({
        absentDateId: createAbsentDate.id,
        userId: user.id,
      }));

      const createManyAbsent = await prisma.absent.createMany({
        data: absentData,
      });

      return {
        status: true,
        message: `Data absensi ${reqData.date} berhasil ditambahkan`,
        code: 201,
      };
    } catch (error) {
      console.error("createAbsentDate module error: ", error);
      return {
        status: false,
        message: error.message,
        code: 500,
      };
    }
  }

  async createManyAbsentDate(reqData) {
    try {
      const checkDate = new Date();
      checkDate.setTime(checkDate.getTime() + 8 * 60 * 60 * 1000);
      const fromDate = new Date(reqData.fromDate);
      const toDate = new Date(reqData.toDate);

      const dayDifference = Math.floor(
        (toDate - fromDate) / (24 * 60 * 60 * 1000),
      );

      const dateArray = Array.from(
        { length: dayDifference + 1 },
        (_, index) => {
          const date = new Date(fromDate);
          date.setTime(date.getTime() + 8 * 60 * 60 * 1000);
          date.setDate(date.getDate() + index);
          return date;
        },
      );

      const absentDateData = dateArray.map((date) => ({
        date: date.toISOString(),
        dayStatus: reqData.dayStatus,
        information: reqData.information,
      }));

      const createManyAbsentDate = await prisma.absentDate.createMany({
        data: absentDateData,
      });

      const readAllAbsentDate = await prisma.absentDate.findMany({
        where: {
          date: {
            gte: fromDate,
            lte: toDate,
          },
        },
      });

      const readAllUser = await prisma.user.findMany({
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

      const absentData = readAllAbsentDate.flatMap((absent) => {
        return readAllUser.map((user) => ({
          absentDateId: absent.id,
          userId: user.id,
        }));
      });

      const createManyAbsent = await prisma.absent.createMany({
        data: absentData,
      });

      return {
        status: true,
        message: `Data absensi tanggal ${reqData.fromDate} - ${reqData.toDate} berhasil ditambah`,
        code: 201,
      };
    } catch (error) {
      console.error("createManyAbsentDate module error: ", error);
      return {
        status: false,
        message: error.message,
        code: 500,
      };
    }
  }

  async readAllAbsentDate(date) {
    try {
      const inputDate = new Date(date);
      const year = inputDate.getFullYear();
      const month = inputDate.getMonth();
      const start = `${year}-${month + 1}-01`;
      const end = `${year}-${month + 2}-01`;
      const startDate = new Date(start);
      const endDate = new Date(end);

      const readAllAbsentDate = await prisma.absentDate.findMany({
        where: {
          date: {
            gte: startDate,
            lt: endDate,
          },
        },
        select: {
          id: true,
          date: true,
          dayStatus: true,
          information: true,
        },
        orderBy: {
          date: "desc",
        },
      });

      const resData = [];

      for (const absentDate of readAllAbsentDate) {
        const object = {
          id: absentDate.id,
          date: absentDate.date.toISOString().split("T")[0],
          dayStatus: absentDate.dayStatus,
          information: absentDate.information,
        };

        resData.push(object);
      }

      return {
        status: true,
        message: "Data berhasil ditemukan",
        data: resData,
        code: 200,
      };
    } catch (error) {
      console.error("readAllAbsentDate module error: ", error);
      return {
        status: false,
        message: error.message,
        code: 500,
      };
    }
  }

  async readAbsentDateById(id) {
    try {
      const readAbsentDateById = await prisma.absentDate.findUnique({
        where: {
          id,
        },
      });

      const resData = {
        id: readAbsentDateById.id,
        date: readAbsentDateById.date,
        dayStatus: readAbsentDateById.dayStatus,
        information: readAbsentDateById.information,
      };

      return {
        status: true,
        message: "Data berhasil ditemukan",
        code: 200,
        data: resData,
      };
    } catch (error) {
      console.error("readAbsentDateById module error: ", error);
      return {
        status: false,
        message: error.message,
        code: 500,
      };
    }
  }

  async updateAbsentDateById(id, reqData) {
    try {
      const updateAbsentById = await prisma.absentDate.update({
        where: {
          id,
        },
        data: {
          dayStatus: reqData.dayStatus,
          information: reqData.information,
        },
      });

      return {
        status: true,
        message: "Data berhasil diubah",
        code: 200,
      };
    } catch (error) {
      console.error("updateAbsentDateById module error: ", error);
      return {
        status: false,
        message: error.message,
        code: 500,
      };
    }
  }

  async deleteAbsentDateById(id) {
    try {
      const deleteAbsent = await prisma.absent.deleteMany({
        where: {
          absentDateId: id,
        },
      });

      const deleteAbsentDate = await prisma.absentDate.delete({
        where: {
          id,
        },
      });

      return {
        status: true,
        message: "Data berhasil dihapus",
        code: 200,
      };
    } catch (error) {
      console.error("deleteAbsentDateById module error: ", error);
      return {
        status: false,
        message: error.message,
        code: 500,
      };
    }
  }
}

module.exports = new AdminAbsentDateModel();
