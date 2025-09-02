import Thread from "../models/Thread.js"
import FavThread from "../models/FavThread.js"
import getOpenAiResponse from "../utils/openai.js";

const getAllChats = async(req, res) => {

    const guestId = req.cookies?.guestId;
    const userId = req.query?.userId;

    try {
        let chats;
        
        if(guestId) {  
            chats = await Thread.find({ownerId: guestId}).sort({updatedAt: -1});
        }
        else if(userId != null) {
            chats = await Thread.find({ownerId: userId}).sort({updatedAt: -1});
        }
        res.status(200).json(chats);
    } catch (err) {
        res.status(404).json({message: "No chat found"});
        console.log(err);
    }
}

const getAllFavChats = async(req, res) => {
    
    const userId = req.query?.userId;

    try {
        const chats = await FavThread.find({ownerId: userId}).sort({updatedAt: -1});
        res.status(200).json(chats);
    } catch (err) {
        res.status(404).json({message: "No fav chat found"});
        console.log(err);
    }
}

const transferOwnership = async (req, res) => {
  const { fromGuestId, toUserId } = req.body;

  if (!fromGuestId || !toUserId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
     const updatedThread = await Thread.updateMany(
      { ownerId: fromGuestId },
      { $set: { ownerId: toUserId, isGuest: false } }
    );

    if (!updatedThread) {
      return res.status(404).json({ error: "Threads not found" });
    }

    res.clearCookie("guestId", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: "/"
    });

    console.log("Thread ownership updated");
    res.status(200).json({ message: "Ownership transferred"});
  } catch (error) {
    console.error(`transferOwnership error: ${error}`);
    res.status(500).json({ error: "(transferOwnership)Internal server error" });
  }
};

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

        if(FavThread.findOne({threadId: id})) {
            await FavThread.findOneAndDelete({threadId: id});
        }
        if(Thread.findOne({threadId: id})) {
            await Thread.findOneAndDelete({threadId: id});
        }
        
        res.status(200).json({message: "chat deleted successfully"});
    } catch (err) {
        res.status(500).json({message: `Something went wrong`});
        console.error(err);
    }
}

// unarchieve chat
const deleteFavChat = async (req, res) => {
    try{
        const {id} = req.params;

        await FavThread.findOneAndDelete({threadId: id});
        res.status(200).json({message: "Chat Unarchieved"});
    } catch (err) {
        res.status(500).json({message: `Something went wrong!`});
        console.error(err);
    }
}

const saveChat = async (req, res) => {
    const { id, message, owner} = req.body;

    if (!id || !message) {
        return res.status(400).json({ message: "Missing required fields!" });
    }

    try {
        let thread = await Thread.findOne({ threadId: id });

        if (!thread) {
            
            thread = new Thread({
                threadId: id,
                ownerId: owner,
                isGuest: owner.startsWith("guest-"),
                title: message,
                messages: [{ role: "user", content: message }]
            });
            const result = await thread.save();

            if(result && result._id) {
                if(owner.startsWith("guest-")) {
                    res.cookie("guestId", owner, {
                        httpOnly: true,
                        secure: true,
                        sameSite: "None",
                        maxAge: 86400000
                    });
                }
            }
        } else {
            thread.messages.push({ role: "user", content: message });
        }

        const models = [
            "openai/gpt-oss-20b:free",
            "qwen/qwen3-14b:free",
            "mistralai/mistral-7b-instruct:free"
        ];

        let assistantReply = null;
        
        for (const model of models) {
            try {
                const response = await getOpenAiResponse(message, model);
                if (typeof response === 'string' && response.trim().length > 0) {
                    assistantReply = response;
                    break;
                } else {
                    console.warn(`Model ${model} returned unusable response.`);
                    continue;
                }
            } catch (err) {
                if (err.code === 429 || err.code === 503) continue;
                else throw err;
            }
        }

        if(assistantReply) {
            console.log("AI response given.")
        }
        if (!assistantReply) {
            assistantReply = "Sorry, I couldn't generate a response right now.";
        } 

        thread.messages.push({ role: "assistant", content: assistantReply });
        thread.updatedAt = new Date();

        await thread.save();

        const favThread = await FavThread.findOne({ threadId: id, ownerId: owner });
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
    const {ownerId} = req.query;

    try {

        const thread = await Thread.findOne({ threadId: id });
        const isFavThreadExist = await FavThread.findOne({threadId: id});

        if(isFavThreadExist) {
            return res.status(409).json({ message: "Archieved chat already exists!" });
        } else { 
            const newthread = new FavThread({
                threadId: id,
                ownerId: ownerId,
                title: thread.title,
                messages: thread.messages,
            });
            await newthread.save();
            res.status(200).json({message: "Chat Archieved"});
        }
    } catch (err) {
        res.status(500).json({message: "Something went wrong!"});
        console.error(err);
    }
}

export { getAllChats, getChat, deleteChat, saveChat, getAllFavChats, saveFavChat, deleteFavChat, getFavChat, transferOwnership };