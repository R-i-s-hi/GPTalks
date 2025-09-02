import express from "express"
import {getAllChats, getChat, deleteChat, saveChat, saveFavChat, getAllFavChats, getFavChat, deleteFavChat, transferOwnership} from "../controllers/controllers.js"
const router = express.Router();


router.get("/thread", getAllChats);
router.get("/favthread", getAllFavChats);

router.post("/threads/transfer-ownership", transferOwnership);

router.post("/chat", saveChat);

router.post("/favchat/:id", saveFavChat); // archieve chat
router.delete("/favthread/:id", deleteFavChat); // unarchieve chat

router.get("/thread/:id", getChat);
router.get("/favthread/:id", getFavChat);

router.delete("/thread/:id", deleteChat);


export default router;