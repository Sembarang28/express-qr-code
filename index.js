const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const routes = require("./src/routes");
require("./src/config/cronjob");

dotenv.config();
const port = process.env.PORT || 8000;
const app = express();

app.use(
  cors({
    origin: process.env.NODE_ENV === "development" || !process.env.NODE_ENV
      ? "http://localhost:5173"
      : process.env.FRONT_URL,
    credential: true,
  }),
);
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use("/public", express.static("public"));

app.get("/test", async function (req, res) {
  res.status(200).send({
    status: true,
    message: "Hello World!!",
  });
});

routes(app);

app.listen(port, () => {
  console.log(`API is running on port ${port}`);
});
