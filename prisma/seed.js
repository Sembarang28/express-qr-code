const bcrypt = require("bcrypt");
const prisma = require("../src/config/db");
const { nanoid } = require("nanoid");

async function main() {
  const password = bcrypt.hashSync("12345678", 12);

  const user = await prisma.user.createMany({
    data: [
      {
        id: nanoid(16),
        name: "Root Admin",
        email: "rootadmin@gmail.com",
        password,
        role: "admin",
      },
      {
        id: nanoid(16),
        name: "John Doe",
        email: "agilfikriawan020328@gmail.com",
        password,
        nip: "19961212 202201 1 001",
        employeeStatus: "PNS",
        role: "admin",
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
