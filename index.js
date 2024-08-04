import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

dotenv.config();
const port = process.env.PORT || 8000;
const app = express();

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "development" || !process.env.NODE_ENV
        ? "http://localhost:4173"
        : process.env.FRONT_URL,
    credential: true,
  }),
);
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.get("/test", async function (req, res) {
  res.status(200).send({
    status: true,
    message: "Hello World!!",
  });
});

app.listen(port, () => {
  console.log(`API is running on port ${port}`);
});
