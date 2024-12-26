import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import dbconnect from "./db/dbconnect.js";
import cookieParser from "cookie-parser";
import cors from 'cors';
const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    dbconnect()
});