const bcrypt = require("bcrypt");
const prisma = require("../src/config/db");

async function main() {
  const password = bcrypt.hashSync("12345678", 12);

  const user = await prisma.user.createMany({
    data: [
      {
        name: "admin",
        email: "test@gmail.com",
        password,
        nip: "19961212 202201 1 001",
        employeeStatus: "PNS",
        role: "admin",
      },
      {
        name: "John Doe",
        email: "john@gmail.com",
        password,
        role: "user",
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
  });
