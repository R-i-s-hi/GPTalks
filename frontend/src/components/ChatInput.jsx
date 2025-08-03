import styles from "../styles/ChatInput.module.css"
function ChatInput() {
    return ( 
        <div className={styles.chatInputContainer}>
            <div>
                <input placeholder="Ask anything"></input>
                <div className="d-flex justify-content-between px-4">
                    <span className={styles.tools}>
                        <div className={styles.icon}>
                            <i class="fa-sharp fa-solid fa-plus"></i>
                        </div>
                        <div className={styles.icon}>
                           <span className="d-flex gap-1 align-items-center">
                                <i class="fa-solid fa-sliders"></i>
                                <p class="mb-0">Tools</p>
                           </span>
                        </div>
                    </span>
                    <span className={styles.sendicon}>
                        <i class="fa-sharp fa-solid fa-arrow-up"></i>
                    </span>
                </div>
            </div>
            <p>GPTalk can make mistakes. Check important info. only for reference.</p>
        </div>
     );
}

export default ChatInput;