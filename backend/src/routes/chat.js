import express from "express"
import {getAllChats, getChat, deleteChat, saveChat, saveFavChat, getAllFavChats, getFavChat, deleteFavChat} from "../controllers/controllers.js"
const router = express.Router();


router.get("/thread", getAllChats);
router.get("/favthread", getAllFavChats);

router.post("/chat", saveChat);
router.post("/favchat/:id", saveFavChat);

router.get("/thread/:id", getChat);
router.get("/favthread/:id", getFavChat);

router.delete("/thread/:id", deleteChat);
router.delete("/favthread/:id", deleteFavChat);


export default router;