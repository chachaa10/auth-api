import { authRouter } from "@/routes/auth.routes";
import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);

export default app;
