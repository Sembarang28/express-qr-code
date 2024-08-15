const prisma = require("../../config/db");

class UserAbsentModel {
  async readAllAbsentsMonthByUserId(reqData, userId) {
    try {
      const inputDate = new Date(reqData.date);
      const year = inputDate.getFullYear();
      const month = inputDate.getMonth();
      const start = `${year}-${month + 1}-01`;
      const end = `${year}-${month + 2}-01`;
      const startDate = new Date(start);
      const endDate = new Date(end);

      const readAllAbsentDateByMonth = await prisma.absentDate.findMany({
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
          date: "asc",
        },
      });

      const readAllAbsentsMonthByUserId = await prisma.user.findFirst({
        where: {
          id: userId,
          absent: {
            some: {
              absentDateId: {
                in: readAllAbsentDateByMonth.map((item) => item.id),
              },
            },
          },
        },
        select: {
          id: true,
          name: true,
          nip: true,
          employeeStatus: true,
          absent: {
            where: {
              absentDateId: {
                in: readAllAbsentDateByMonth.map((item) => item.id),
              },
            },
            select: {
              absentDateId: true,
              status: true,
              absentDate: {
                select: {
                  date: true,
                  dayStatus: true,
                },
              },
            },
            orderBy: {
              absentDate: {
                date: "asc",
              },
            },
          },
        },
      });

      if (!readAllAbsentsMonthByUserId) {
        return {
          status: false,
          message: "Data tidak ditemukan",
          code: 404,
        };
      }

      let resAbsentDate = [];

      readAllAbsentDateByMonth.forEach((date) => {
        const object = {
          date: date.date.toISOString(),
          dayStatus: date.dayStatus,
        };

        resAbsentDate.push(object);
      });

      const listAbsent = [];

      readAllAbsentsMonthByUserId.absent.forEach((absent) => {
        const object = {
          absentDateId: absent.absentDateId,
          status: absent.status,
          date: absent.absentDate.date.toISOString().split("T")[0],
          dayStatus: absent.absentDate.dayStatus,
        };

        listAbsent.push(object);
      });

      const resData = [
        {
          id: readAllAbsentsMonthByUserId.id,
          name: readAllAbsentsMonthByUserId.name,
          nip: readAllAbsentsMonthByUserId.nip,
          employeeStatus: readAllAbsentsMonthByUserId.employeeStatus,
          absent: listAbsent,
        },
      ];

      return {
        status: true,
        message: "Data berhasil ditemukan",
        data: {
          absentData: resData,
          absentDateData: resAbsentDate,
        },
        code: 200,
      };
    } catch (error) {
      console.error("readAllAbsentByDate module error: ", error);
      return {
        status: false,
        message: error.message,
        code: 500,
      };
    }
  }
}

module.exports = new UserAbsentModel();
