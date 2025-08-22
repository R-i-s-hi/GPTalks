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

  const { isLoader, prevChats, setPrevChats, newChat, reply} = useContext(AllContext);
  const [latestReply, setLatestReply] = useState(null);
  const {isAuthenticated, user} = useAuth0();

  useEffect(() => {

    if(!prevChats?.length) return;
    if (reply === null) {
      setLatestReply(null);
      return;
    }

    const content = reply.split(" ");

    let idx = 0;
    const interval = setInterval(() => {
      setLatestReply(content.slice(0, idx + 1).join(" "));

      idx++;
      if (idx >= content.length) clearInterval(interval);

    }, 40);

    return () => clearInterval(interval);
  }, [prevChats, reply]);


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
        </>
      ) : (
        <>
            <div className={styles.chats}>
                {prevChats?.map((chat, idx) => {
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
                            {chat.content}
                        </ReactMarkdown>
                        </div>
                    )}
                    </div>
                );
                })}
                { prevChats.length > 0 && latestReply != null && (
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
        </>
      )}

    </div>
  );
}

export default Chat;