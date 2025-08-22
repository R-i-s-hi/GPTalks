import Thread from "../models/Thread.js"
import FavThread from "../models/FavThread.js"
import getOpenAiResponse from "../utils/openai.js";

const getAllChats = async(req, res) => {
    try {
        const chats = await Thread.find({}).sort({updatedAt: -1});
        res.status(200).json(chats);
    } catch (err) {
        res.status(404).json({message: "No chat found"});
        console.log(err);
    }
}

const getAllFavChats = async(req, res) => {
    try {
        const chats = await FavThread.find({}).sort({updatedAt: -1});
        res.status(200).json(chats);
    } catch (err) {
        res.status(404).json({message: "No fav chat found"});
        console.log(err);
    }
}

const getChat = async (req, res) => {
    try {
        const {id} = req.params;
        const chat = await Thread.findOne({threadId: id});
        res.status(200).json(chat.messages);
    } catch (err) {
        res.status(404).json({message: "No chat found"});
        console.log(err);
    }
}

const getFavChat = async (req, res) => {
    try {
        const {id} = req.params;
        const chat = await FavThread.findOne({threadId: id});
        res.status(200).json(chat.messages);
    } catch (err) {
        res.status(404).json({message: "No chat found"});
        console.log(err);
    }
}

const deleteChat = async (req, res) => {
    try{
        const {id} = req.params;

        await Thread.findOneAndDelete({threadId: id});
        res.status(200).json({message: "chat deleted successfully"});
    } catch (err) {
        res.status(500).json({message: `Something went wrong`});
        console.error(err);
    }
}

const deleteFavChat = async (req, res) => {
    try{
        const {id} = req.params;

        await FavThread.findOneAndDelete({threadId: id});
        res.status(200).json({message: "chat deleted successfully"});
    } catch (err) {
        res.status(500).json({message: `Something went wrong`});
        console.error(err);
    }
}

const saveChat = async (req, res) => {
    const { id, message } = req.body;

    if (!id || !message) {
        return res.status(400).json({ message: "Missing required fields!" });
    }

    try {
        let thread = await Thread.findOne({ threadId: id });

        if (!thread) {
            thread = new Thread({
                threadId: id,
                title: message,
                messages: [{ role: "user", content: message }]
            });
            await thread.save();

        } else {
            thread.messages.push({ role: "user", content: message });
        }

        const assistantReply = await getOpenAiResponse(message);

        if(assistantReply) {
            console.log("AI response given.")
        }
        if (!assistantReply) {
            console.warn("Assistant reply was null. Skipping save.");
            return res.status(502).json({ message: "AI failed to respond." });
        } 

        thread.messages.push({ role: "assistant", content: assistantReply });
        thread.updatedAt = new Date();

        await thread.save();

        const favThread = await FavThread.findOne({ threadId: id });
        if (favThread) {
            favThread.messages = thread.messages;
            favThread.updatedAt = new Date();
            await favThread.save();
        }

        res.json({ reply: assistantReply });
    } catch (err) {
        console.error("saveChat error:", err);
        res.status(500).json({ message: "Something went wrong." });
    }
};

const saveFavChat = async(req, res) => {
    const {id} = req.params;

    try {

        const thread = await Thread.findOne({ threadId: id });
        const isFavThreadExist = await FavThread.findOne({threadId: id});

        if(isFavThreadExist) {
            return res.status(200).json({ message: "Archieved chat already exists!" });
        } else { 
            const newthread = new FavThread({
                threadId: id,
                title: thread.title,
                messages: thread.messages,
            });
            await newthread.save();
            res.status(200).json({message: "Chat saved as favorite successfully"});
        }
    } catch (err) {
        res.status(500).json({message: `Something went wrong`});
        console.error(err);
    }
}

export { getAllChats, getChat, deleteChat, saveChat, getAllFavChats, saveFavChat, deleteFavChat, getFavChat };