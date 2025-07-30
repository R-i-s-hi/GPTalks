import express from "express"
import {getAllChats, getChat, deleteChat, saveChat} from "../controllers/controllers.js"
const router = express.Router();


router.get("/thread", getAllChats);
router.post("/chat", saveChat);
router.get("/thread/:id", getChat);
router.delete("/thread/:id", deleteChat);


export default router;