const cron = require("node-cron");
const prisma = require("./db");

async function createAbsentDate() {
  const dateNow = new Date();
  dateNow.setTime(dateNow.getTime() + 8 * 60 * 60 * 1000);
  const date = new Date(dateNow.toISOString().split("T")[0]);

  const createAbsentDate = await prisma.absentDate.create({
    data: {
      date,
      dayStatus: "Kerja",
      information: "Hari ditambah otomatis dari sistem",
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
}

async function updateAbsent() {
  const dateNow = new Date();
  dateNow.setTime(dateNow.getTime() + 8 * 60 * 60 * 1000);
  const date = new Date(dateNow.toISOString().split("T")[0]);

  const readAbsentDate = await prisma.absentDate.findFirst({
    where: {
      date,
    },
  });

  const updateManyAbsent = await prisma.absent.updateMany({
    where: {
      absentDateId: readAbsentDate.id,
      status: null,
    },
    data: {
      status: "Alpa",
      information: "Alpa secara otomatis dari sistem",
    },
  });
}

cron.schedule(
  "00 05 * * *",
  () => {
    createAbsentDate();
    console.log("create absent date executed!");
  },
  {
    timezone: "asia/makassar",
  },
);

cron.schedule(
  "00 16 * * *",
  () => {
    updateAbsent();
    console.log("update absent executed!");
  },
  {
    timezone: "asia/makassar",
  },
);

module.exports = cron;
