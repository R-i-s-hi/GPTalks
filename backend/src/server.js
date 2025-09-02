import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import chatRoutes from "./routes/chat.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cors({
    origin: 'gp-talks.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(cookieParser());

mongoose.connect(process.env.DB_URL)
    .then(() => console.log("DB Connected"))
    .catch(e => console.log(e))



app.use("/api", chatRoutes);




app.listen(5000, () => {
    console.log(`server running on port 5000`);
})