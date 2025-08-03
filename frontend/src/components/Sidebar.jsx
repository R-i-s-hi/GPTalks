import styles from "../styles/Sidebar.module.css";
import { useState } from "react";

function Sidebar() {
    let [isOpen, setIsOpen] = useState(true);
    let [showFavChats, setShowFavChats] = useState(false);

    const sidebarHandler = () => {
        setIsOpen((prev) => !prev);
    }
    const FavChatHandler = () => {
        setShowFavChats((prev) => !prev);
    }

    return (
        <div>
            {isOpen ? 
                (<div className={`${styles.sidebarContainer} ${!isOpen ? styles.offcanvas : ''}`}>
                    <div className={styles.top}>
                        <p className="mb-0 fs-4"><i class="fa-solid fa-hexagon-nodes"></i></p>
                        <button onClick={sidebarHandler} type="button">
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    <div>
                        <button style={{display: "flex", alignItems: "center", width: "100%", height: "2.5rem", marginTop: "1.3rem", paddingInlineStart: "1rem"}} type="button">
                            <i class="fa-solid fa-pen-to-square fw-normal"></i>
                            <p className="mb-0 ms-2">New chat</p>
                        </button>
                    </div>
                    <div className={styles.main}>
                        {showFavChats ? (
                            <div>fav chats</div>
                        ) : (
                            <div>all chats</div>
                        )}
                    </div>
                    <hr className="mt-1 mb-1" style={{color: "#d3cfcfff"}}></hr>
                    <div>
                        {showFavChats ? (
                            <button className={styles.bottomBtn1} onClick={FavChatHandler}> 
                                    <i class="fa-regular fa-copy ps-2"></i>
                                    <p className="mb-0 ms-3">All Chats</p>
                            </button>
                        ) : (
                            <button className={styles.bottomBtn2} onClick={FavChatHandler}> 
                                <i class="fa-regular fa-star ps-2"></i>
                                <p className="mb-0 ms-3">Favourates</p>
                            </button> 
                        )} 
                    </div>
                </div>) :
                (<div className={styles.sidebarContainerClosed}>
                    <button onClick={sidebarHandler} type="button">
                            <i class="fa-solid fa-bars-staggered"></i>
                    </button>

                    
                    <button style={{display: "flex", alignItems: "center", width: "100%", padding: "0.5rem", marginTop: "1.3rem"}} type="button">
                        <i class="fa-solid fa-pen-to-square fw-normal"></i>
                    </button>
                    
                </div>)
            }
        </div>
    )
}

export default Sidebar;