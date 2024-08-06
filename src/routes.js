const adminRoutes = require("./admin/adminRoutes");
const authController = require("./auth/authController");

const listRoutes = [
  ["/auth", authController],
  ["/admin", adminRoutes],
];

function routes(app) {
  listRoutes.forEach((route) => {
    app.use(`/api/${route[0]}`, route[1]);
  });
}

module.exports = routes;
