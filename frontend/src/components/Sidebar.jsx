import styles from "../styles/Sidebar.module.css";
import { useState } from "react";

function Sidebar() {
    let [isOpen, setIsOpen] = useState(true);

    const sidebarHandler = () => {
        setIsOpen((prev) => !prev);
    }

    return (
        <div>
            {isOpen ? 
                (<div className={styles.sidebarContainer}>
                    <div className={styles.top}>
                        <p className="mb-0 fs-4"><i class="fa-solid fa-hexagon-nodes"></i></p>
                        <button onClick={sidebarHandler} type="button">
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    <div>
                        <button style={{display: "flex", alignItems: "center", width: "100%", height: "2.5rem", marginTop: "1.3rem", paddingInlineStart: "1rem"}} type="button">
                            <i class="fa-solid fa-pen-to-square fw-normal"></i>
                            <p className="mb-0 ms-2">New Chat</p>
                        </button>
                    </div>
                    <div className={styles.main}>
                        <p>chats</p>
                    </div>
                    <hr className="mt-1 mb-1"></hr>
                    <div>
                        <button style={{display: "flex", alignItems: "center", width: "100%", height: "3.5rem", paddingInlineStart: "1rem", borderRadius: "16px", marginTop: "0.7rem"}}> 
                            <i class="fa-regular fa-star"></i>
                            <p className="mb-0 ms-2">Favourates</p>
                        </button>
                        
                    </div>
                </div>) :
                (<div className={styles.sidebarContainerClosed}>
                    <button onClick={sidebarHandler} type="button">
                            <i class="fa-solid fa-bars-staggered"></i>
                    </button>
                </div>)
            }
        </div>
    )
}

export default Sidebar;