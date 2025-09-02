import styles from "../styles/ChatInput.module.css"
import { useAuth0 } from "@auth0/auth0-react";
import { AllContext } from "../contexts/context";
import { useContext, useEffect } from "react";
import { v1 as uuidv1 } from "uuid";

function ChatInput() {

    const {prompt, setPrompt, reply, setReply, currThreadId, setCurrThreadId, isLoader, setIsLoader, prevChats, setPrevChats, newChat, setNewChat} = useContext(AllContext);
    
    const {
        isAuthenticated,
        user,
    } = useAuth0();

    const getReply = async (currThreadId) => {

        console.log(`getReply-currThread: ${currThreadId}`);
        
        let guestId = null;

        if(!isAuthenticated) {
            guestId = localStorage.getItem("guestId");
            
            if (!guestId) {
                guestId = `guest-${uuidv1()}`;
                localStorage.setItem("guestId", guestId);
            }
    
            if(user?.sub) {
                localStorage.removeItem("guestId");
                guestId = null;
            }
        }

        const ownerId = isAuthenticated ? user.sub : guestId;

        setNewChat(false);
        setIsLoader(true);

        const userMessage = prompt;
        setPrompt("");

        const optn = {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: currThreadId,
                message: userMessage,
                owner: ownerId
            })
        };

        try {
            const response = await fetch("http://localhost:5000/api/chat", optn);
            const rep = await response.json();

            if (rep?.reply) {
                const cleaned = rep.reply
                    .replace(/\r\n/g, "\n")
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
            <div style={{display: "flex"}}>
                <div className={styles.icon}>
                    <i class="fa-solid fa-plus"></i>
                </div>
                <textarea
                    placeholder="Ask anything"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault(); // Prevent newline
                        getReply(currThreadId); // Submit message
                        }
                    }}
                    rows={1}
                ></textarea>
                <span className={styles.sendicon} type="button" onClick={() => getReply(currThreadId)}>
                        <i class="fa-regular fa-paper-plane"></i>
                </span>
            </div>
            <p className={styles.bottom_line}>GPTalk can make mistakes. Check important info. only for reference.</p>
        </div>
     );
}

export default ChatInput;