const adminRoutes = require("./admin/adminRoutes");
const authController = require("./auth/authController");
const userRoutes = require("./user/userRoutes");

const listRoutes = [
  ["/auth", authController],
  ["/admin", adminRoutes],
  ["/user", userRoutes],
];

function routes(app) {
  listRoutes.forEach((route) => {
    app.use(`/api${route[0]}`, route[1]);
  });
}

module.exports = routes;
