const prisma = require("../../config/db");

class AbsentModel {
  async scanqr(reqData) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          qrCode: reqData.qrcode,
        },
        select: {
          id: true,
          name: true,
          nip: true,
          employeeStatus: true,
        },
      });

      if (!user) {
        return {
          status: false,
          message: "QR Code kadaluarsa silahkan generate ulang",
          code: 400,
        };
      }

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          qrCode: "",
        },
      });

      const dateTime = new Date(reqData.date);
      dateTime.setTime(dateTime.getTime() + 8 * 60 * 60 * 1000);
      const date = new Date(dateTime.toISOString().split("T")[0]);
      const hour = dateTime.getUTCHours();

      let checkAbsentDate = await prisma.absentDate.findFirst({
        where: {
          date,
        },
      });

      if (!checkAbsentDate) {
        const createAbsentDate = await prisma.absentDate.create({
          data: {
            date,
            dayStatus: "Kerja",
            information: "Hari Kerja",
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

        checkAbsentDate = createAbsentDate;
      }

      let arrivalAbsent = false;
      let returnAbsent = false;
      let absentTime = "";

      if (hour >= 6 && hour <= 11) {
        arrivalAbsent = true;
        absentTime = " datang ";
      } else if (hour >= 12 && hour <= 14) {
        returnAbsent = true;
        absentTime = " pulang ";
      } else {
        return {
          status: false,
          message:
            "Absensi tidak bisa dilakukan dalam jangkauan waktu jam 6 - 11 dan jam 12 - 14",
          code: 400,
        };
      }

      let findAbsentId = await prisma.absent.findFirst({
        where: {
          absentDateId: checkAbsentDate.id,
          userId: user.id,
        },
      });

      if (!findAbsentId) {
        const createAbsent = await prisma.absent.create({
          data: {
            absentDateId: checkAbsentDate.id,
            userId: user.id,
            status: null,
            information: null,
          },
        });

        findAbsentId = createAbsent;
      }

      const status =
        (findAbsentId.arrivalAbsent || arrivalAbsent) &&
        (findAbsentId.returnAbsent || returnAbsent)
          ? "Hadir"
          : null;

      const message =
        status === "Hadir"
          ? `${user.name} dinyatakan hadir`
          : `Absensi${absentTime}${user.name} diterima`;

      const scanqr = await prisma.absent.update({
        where: {
          id: findAbsentId.id,
        },
        data: {
          arrivalAbsent: findAbsentId.arrivalAbsent || arrivalAbsent,
          returnAbsent: findAbsentId.returnAbsent || returnAbsent,
          status,
          information: "Hadir melalui scan",
        },
      });

      return {
        status: true,
        message,
        code: 200,
      };
    } catch (error) {
      console.error("scanqr module error: ", error);
      return {
        status: false,
        message: error.message,
        code: 500,
      };
    }
  }

  async createAbsent(reqData) {
    try {
      const createAbsent = await prisma.absent.create({
        data: {
          absentDateId: reqData.absentDateId,
          userId: reqData.userId,
          status: reqData.status,
          information: reqData.information,
        },
      });

      return {
        status: true,
        message: "Data berhasil ditambahkan",
        code: 201,
      };
    } catch (error) {
      console.error("createAbsent module error: ", error);
      return {
        status: false,
        message: error.message,
        code: 500,
      };
    }
  }

  async readAllAbsent() {
    try {
      const readAllAbsent = await prisma.absent.findMany({
        select: {
          id: true,
          absentDateId: true,
          absentDate: {
            select: {
              date: true,
            },
          },
          userId: true,
          user: {
            select: {
              name: true,
            },
          },
          status: true,
          information: true,
        },
        orderBy: [
          {
            absentDate: {
              date: "desc",
            },
          },
          {
            user: {
              name: "asc",
            },
          },
        ],
      });

      const resData = readAllAbsent.map((absent) => ({
        id: absent.id,
        absentDateId: absent.absentDateId,
        date: absent.absentDate.date.toISOString().split("T")[0],
        userId: absent.userId,
        name: absent.user.name,
        status: absent.status,
        information: absent.information,
      }));

      return {
        status: true,
        message: "Data berhasil ditemukan",
        data: resData,
        code: 200,
      };
    } catch (error) {
      console.error("readAllAbsent module error: ", error);
      return {
        status: false,
        message: error.message,
        code: 500,
      };
    }
  }

  async readAllAbsentByDate(reqData) {
    try {
      const date = new Date(reqData.date);
      const readAllAbsentByDate = await prisma.absent.findMany({
        where: {
          absentDate: {
            date,
          },
        },
        select: {
          id: true,
          absentDateId: true,
          absentDate: {
            select: {
              date: true,
              dayStatus: true,
            },
          },
          userId: true,
          user: {
            select: {
              name: true,
              nip: true,
              employeeStatus: true,
            },
          },
          status: true,
          arrivalAbsent: true,
          returnAbsent: true,
          information: true,
        },
        orderBy: {
          user: {
            name: "asc",
          },
        },
      });

      if (readAllAbsentByDate == []) {
        return {
          status: false,
          message: "Data tidak ditemukan",
          code: 400,
        };
      }

      const absentData = [];

      for (const absent of readAllAbsentByDate) {
        const object = {
          id: absent.id,
          absentDateId: absent.absentDateId,
          date: absent.absentDate.date.toISOString().split("T")[0],
          dayStatus: absent.absentDate.dayStatus,
          userId: absent.userId,
          name: absent.user.name,
          nip: absent.user.nip,
          employeeStatus: absent.user.employeeStatus,
          status: absent.status,
          information: absent.information,
        };

        absentData.push(object);
      }

      const readAllUser = await prisma.user.findMany({
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

      const readAllAbsentDate = await prisma.absentDate.findMany({
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

      const absentDateData = [];

      for (const absentDate of readAllAbsentDate) {
        const object = {
          id: absentDate.id,
          date: absentDate.date.toISOString().split("T")[0],
          dayStatus: absentDate.dayStatus,
          information: absentDate.information,
        };

        absentDateData.push(object);
      }

      return {
        status: true,
        message: "Data berhasil ditemukan",
        code: 200,
        data: {
          absentData,
          absentDateData,
          userData: readAllUser,
        },
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

  async readAllAbsentByMonth(reqData) {
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

      const readAllAbsentByMonth = await prisma.user.findMany({
        where: {
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
        orderBy: {
          name: "asc",
        },
      });

      const resAbsentDateData = [];

      for (const absentDate of readAllAbsentDateByMonth) {
        const object = {
          date: absentDate.date.toISOString(),
          dayStatus: absentDate.dayStatus,
        };

        resAbsentDateData.push(object);
      }

      const resAbsentData = [];

      for (const user of readAllAbsentByMonth) {
        const listAbsent = [];
        const uniqueDates = new Set();

        if (user.absent[0].absentDateId) {
          for (const absent of user.absent) {
            if (!uniqueDates.has(absent.absentDate.date.toISOString())) {
              uniqueDates.add(absent.absentDate.date.toISOString());

              const absentObject = {
                absentDateId: absent.absentDateId,
                status: absent.status,
                date: absent.absentDate.date.toISOString().split("T")[0],
                dayStatus: absent.absentDate.dayStatus,
              };

              listAbsent.push(absentObject);
            }
          }
        }

        const object = {
          id: user.id,
          name: user.name,
          nip: user.nip,
          employeeStatus: user.employeeStatus,
          absent: listAbsent,
        };

        resAbsentData.push(object);
      }

      return {
        status: true,
        message: "Data berhasil ditemukan",
        code: 200,
        data: {
          absentData: resAbsentData,
          absentDateData: resAbsentDateData,
        },
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

  async readAbsentById(id) {
    try {
      const readAbsentById = await prisma.absent.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          absentDateId: true,
          absentDate: {
            select: {
              date: true,
            },
          },
          userId: true,
          user: {
            select: {
              name: true,
            },
          },
          status: true,
          information: true,
        },
      });

      const resData = {
        id: readAbsentById.id,
        absentDateId: readAbsentById.absentDateId,
        absentDate: readAbsentById.absentDate.date.toISOString().split("T")[0],
        userId: readAbsentById.userId,
        name: readAbsentById.user.name,
        status: readAbsentById.status,
        information: readAbsentById.information,
      };

      return {
        status: true,
        message: "Data berhasil ditemukan",
        code: 200,
        data: resData,
      };
    } catch (error) {
      console.error("readAbsentById module error: ", error);
      return {
        status: false,
        message: error.message,
        code: 500,
      };
    }
  }

  async updateManyAbsent(reqData) {
    try {
      const date = new Date(reqData.date);

      const readAbsentDate = await prisma.absentDate.findFirst({
        where: {
          date,
        },
        select: {
          id: true,
          date: true,
          dayStatus: true,
          information: true,
        },
      });

      const updateManyAbsent = await prisma.absent.updateMany({
        where: {
          absentDateId: readAbsentDate.id,
          status: null,
        },
        data: {
          status: reqData.status,
          information: reqData.information,
        },
      });

      return {
        status: true,
        message: "Data berhasil diubah",
        code: 200,
      };
    } catch (error) {
      console.error("updateManyAbsent module error: ", error);
      return {
        status: false,
        message: error.message,
        code: 500,
      };
    }
  }

  async updateAbsentById(id, reqData) {
    try {
      const updateAbsentById = await prisma.absent.update({
        where: {
          id,
        },
        data: {
          status: reqData.status,
          information: reqData.information,
        },
      });

      return {
        status: true,
        message: "Data berhasil diubah",
        code: 200,
      };
    } catch (error) {
      console.error("updateAbsentById module error: ", error);
      return {
        status: false,
        message: error.message,
        code: 500,
      };
    }
  }

  async deleteAbsentById(id) {
    try {
      const deleteAbsentById = await prisma.absent.delete({
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
      console.error("deleteAbsentById module error: ", error);
      return {
        status: false,
        message: error.message,
        code: 500,
      };
    }
  }
}

module.exports = new AbsentModel();
