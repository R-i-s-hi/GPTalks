import styles from "../styles/Chatwindow.module.css"
import Navbar from "./Navbar.jsx"
import Chat from "./Chat.jsx";
import ChatInput from "./ChatInput.jsx"

function ChatWindow() {

    return ( 
        <>
        <div className={styles.ChatWindowContainer}>
            <Navbar />
            <Chat />
            <ChatInput/>
        </div>
        </>
     );
}

export default ChatWindow;