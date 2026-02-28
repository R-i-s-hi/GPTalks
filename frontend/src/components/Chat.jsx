import styles from "../styles/Chat.module.css";
import { ScaleLoader } from "react-spinners";
import { AllContext } from "../contexts/context";
import { useContext, useState, useEffect} from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import "highlight.js/styles/github-dark.css";
import { useAuth0 } from "@auth0/auth0-react";

function Chat() {

  const { isLoader, prevChats, setPrevChats, newChat, reply, latestReply, setLatestReply} = useContext(AllContext);
  const {isAuthenticated, user} = useAuth0();
  const [animatedReplyId, setAnimatedReplyId] = useState(null);

  useEffect(() => {
    if (!reply) return;

    // Only animate if this reply is new
    if (animatedReplyId === reply) return;

    const words = reply.split(" ");
    let idx = 0;

    const interval = setInterval(() => {
      setLatestReply(words.slice(0, idx + 1).join(" "));
      idx++;
      if (idx >= words.length) {
        clearInterval(interval);
        setAnimatedReplyId(reply); // mark this reply as animated
      }
    }, 40);

    return () => clearInterval(interval);
  }, [reply, animatedReplyId]);


  return (
    <div className={styles.chatsDisplay}>
      {newChat || prevChats.length === 0 ? (
        <>
        <h1 className={styles.newChatLine}>
          {
            isAuthenticated && (<>Hi {user.name}, <br /> </>)
          }
          Start a New chat!
        </h1>
        {isLoader ? (
                <ScaleLoader
                    color="var(--text-color)"
                    style={{ display: "flex", justifyContent: "center" }}
                />
                ) : (
                <></>
                )}
        </>
      ) : (

        <div className={styles.chats}>
            {prevChats?.map((chat, idx) => {
              const isLastAssistant = idx === prevChats.length - 1 && chat.role === "assistant";
              return (
                  <div
                  className={
                      chat.role === "user" ? styles.userChat : styles.gptChat
                  }
                  key={idx}
                  >
                  {chat.role === "user" ? (
                      <p className={styles.userMsg}>{chat.content}</p>
                  ) : (
                      <div className={styles.gptMsg}>
                      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                          {isLastAssistant && animatedReplyId !== reply ? latestReply : chat.content}
                      </ReactMarkdown>
                      </div>
                  )}
                  </div>
              )
            })
            }
            { prevChats.length > 0 && latestReply != null && prevChats[prevChats.length - 1]?.content !== reply && (
            <div className={styles.gptMsg}  key={"typing"}>
                <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeHighlight]}
                >
                {latestReply}
                </ReactMarkdown>
            </div>
            )}
            {isLoader ? (
            <ScaleLoader
                color="var(--text-color)"
                style={{ display: "flex", justifyContent: "center" }}
            />
            ) : (
            <></>
            )}
        </div>

      )}

    </div>
  );
}

export default Chat;