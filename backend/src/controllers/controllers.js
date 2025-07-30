import Thread from "../models/Thread.js"
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

const saveChat = async(req, res) => {
    const {id, message} = req.body;

    if(!id || !message) res.status(400).json({message: "missing required fields!"})

    try {
        const thread = await Thread.findOne({threadId: id});

        if(!thread) {
            thread = new Thread({
                threadId: id,
                title: message,
                messages: [{role: "user", content: message}]
            });

            await thread.save();
        
        } else {
            thread.messages.push({role: "user", content: message});
        }

        const assistantReply = await getOpenAiResponse(message);
        thread.messages.push({role: "assistant", content: assistantReply});
        thread.updatedAt = new Date();

        await thread.save();
        res.json({reply: assistantReply});
    } catch (err) {
        res.status(500).json({message: `Something went wrong`});
        console.error(err);
    }
}

export { getAllChats, getChat, deleteChat, saveChat };