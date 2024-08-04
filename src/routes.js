const authController = require("./auth/authController");

const listRoutes = [["/auth", authController]];

function routes(app) {
  listRoutes.forEach((route) => {
    app.use(`/api/v1/${route[0]}`, route[1]);
  });
}

module.exports = routes;
