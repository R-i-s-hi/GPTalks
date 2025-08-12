import styles from "../styles/ChatInput.module.css"
import { AllContext } from "../contexts/context";
import { useContext, useEffect } from "react";

function ChatInput() {

    const {prompt, setPrompt, reply, setReply, currThreadId, setCurrThreadId, isLoader, setIsLoader, prevChats, setPrevChats, newChat, setNewChat} = useContext(AllContext);

const getReply = async () => {
    setNewChat(false);
    setIsLoader(true);

    const userMessage = prompt; // capture before clearing
    setPrompt("");

    const optn = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: currThreadId,
            message: userMessage
        })
    };

    try {
        const response = await fetch("http://localhost:5000/api/chat", optn);
        const rep = await response.json();

        if (rep?.reply) {
            const cleaned = rep.reply
                .replace(/\r\n/g, "\n") // Normalize line endings
                .replace(/(\d+\.\s)/g, "\n$1") 


            setReply(cleaned);
            setPrevChats((prev) => [
                ...prev,
                { role: "user", content: userMessage },
                { role: "assistant", content: cleaned }
            ]);
        }

        setIsLoader(false);
    } catch (e) {
        console.log(`getReply Error: ${e}`);
    }
};


    useEffect(() => {
        if (prompt && reply) {
            setPrevChats((prev) => [
                ...prev,
                {
                    role: "user",
                    content: prompt
                }, {
                    role: "assistant",
                    content: reply
                }
            ]);
        }
    }, [reply]);

    return ( 
        <div className={styles.chatInputContainer}>
            <div style={{display: "flex", flexDirection: "column"}}>
                <input
                    placeholder="Ask anything"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' ? getReply() : ''}
                ></input>
                <div className="d-flex justify-content-between px-4">
                    <span className={styles.tools}>
                        <div className={styles.icon}>
                            <i class="fa-solid fa-plus"></i>
                        </div>
                        <div className={styles.icon}>
                           <span className="d-flex gap-1 align-items-center justify-content-between tool-span">
                                <i class="fa-solid fa-sliders"></i>
                                <p class="mb-0">Tools</p>
                           </span>
                        </div>
                    </span>
                    <span className={styles.sendicon} type="button" onClick={getReply}>
                        <i class="fa-solid fa-arrow-up"></i>
                    </span>
                </div>
            </div>
            <p className={styles.bottom_line}>GPTalk can make mistakes. Check important info. only for reference.</p>
        </div>
     );
}

export default ChatInput;