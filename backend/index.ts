import dotenv from "dotenv";
import express from "express";
import router from "./src/router";
import cookieParser from "cookie-parser";
import { checkDbConnection } from "./src/utils/db";
import cors from "cors";

dotenv.config();
const app = express();

// Only for dev
app.use(
  cors({
    origin: "http://localhost:1000",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/", router);

const PORT = process.env.BACKEND_PORT;

const appStart = async () => {
  await checkDbConnection();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

appStart();
