import styles from "../styles/Chat.module.css"
import {ScaleLoader} from 'react-spinners'
import { AllContext } from "../contexts/context";
import { useContext, useState, useEffect,useRef } from "react";
import ReactMarkdown from "react-markdown" 
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import "highlight.js/styles/github-dark.css"

function Chat() {

    const {isLoader, prevChats, newChat, reply, latestReply, setLatestReply} = useContext(AllContext);
    const lastMsgRef = useRef(null);
    const isTyping = latestReply !== null && latestReply !== reply;

    useEffect(() => {
         const timeout = setTimeout(() => {
            if (lastMsgRef.current) {
            lastMsgRef.current.scrollIntoView({ behavior: "smooth" });
            }
        }, 100); // delay scroll to avoid jitter

        return () => clearTimeout(timeout);
    }, [latestReply, isLoader]);

    useEffect(() => {
        if(reply === null){
            setLatestReply(null);
            return;   
        }

        const content = reply.split(" ");

        let idx = 0;
        const interval = setInterval(() => {
            setLatestReply(content.slice(0, idx+1).join(" "))
        
            idx++;
            if(idx >= content.length) clearInterval(interval);
        
        }, 40)

        return () => clearInterval(interval);

    }, [reply])

    return ( 
        <div className={styles.chatsDisplay}>
            {(newChat || !prevChats) ? 
                <h1 className={styles.newChatLine}>Start a New chat!</h1> : ""
            }
            
            <div className={styles.chats}>
                {
                    prevChats?.map((chat, idx) => {
                        const isLast = idx === prevChats.length - 1;
                        return (
                            <div
      className={chat.role === "user" ? styles.userChat : styles.gptChat}
      key={idx}
      ref={isLast ? lastMsgRef : null}
    >
      {chat.role === "user" ? (
        <p className={styles.userMsg}>{chat.content}</p>
      ) : (
        <div className={styles.gptMsg}>
          <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
            {chat.content}
          </ReactMarkdown>
        </div>
      )}
    </div>
                        )
                    })
                }
                {
                    isTyping && (
                    <div className={styles.gptMsg} ref={lastMsgRef} key={"typing"}>
                        <ReactMarkdown  remarkPlugins={[remarkGfm]}
  rehypePlugins={[rehypeRaw, rehypeHighlight]}>
                            {latestReply}
                        </ReactMarkdown>
                    </div>
                    )
                }
                {(isLoader) ? <ScaleLoader color="var(--text-color)" ref={lastMsgRef} style={{display: "flex", justifyContent: "center"}}/> : <></>}
            </div>
        </div>
     );
}

export default Chat;