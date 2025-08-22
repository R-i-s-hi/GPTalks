import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import chatRoutes from "./routes/chat.js"

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.DB_URL)
    .then(() => console.log("DB Connected"))
    .catch(e => console.log(e))



app.use("/api", chatRoutes);



app.listen(5000, () => {
    console.log(`server running on port 5000`);
})