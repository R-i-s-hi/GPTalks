import styles from "../styles/Sidebar.module.css";
import { useContext, useEffect, useState } from "react";
import { AllContext } from "../contexts/context";

function Sidebar() {

    const {allThreads, setAllThreads, allFavThreads, setAllFavThraeds, currThreadId} = useContext(AllContext);


    const getAllThreads = async () => {

        try {
            const chats = await fetch("http://localhost:5000/api/thread");
            const res = await chats.json();
            const fillteredData = res.map(thread => ({threadId: thread.threadId, title: thread.title}));
            setAllThreads(fillteredData);
        } catch (e) {
            console.log(`getAllThraeds error: ${e}`);
        }
    }
    const getAllFavThreads = async () => {

        try {
            const favChats = await fetch("http://localhost:5000/api/favthread");
            const res = await favChats.json();
            const favFillterdData = res.map(thread => ({threadId: thread.threadId, title: thread.title}));
            setAllFavThraeds(favFillterdData);
        } catch (e) {
            console.log(`getAllFavThraeds error: ${e}`);
        }
    }

    useEffect(() => {
        getAllThreads();
        getAllFavThreads();
    }, [currThreadId]);

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
                    {showFavChats ? (<div className={styles.tagLine}>Archieved chats</div>) : (<div className={styles.tagLine}>all chats</div>)}
                    <div className={styles.main}>
                        {showFavChats ? (
                            <>       
                                <ul>
                                    {
                                        allFavThreads? (allFavThreads.map((thread, idx) => (
                                            <li key={idx}>{thread.title}</li>
                                        ))) : (
                                            <>No archieved chats</>
                                        )
                                        
                                    } 
                                </ul>
                            </>
                        ) : (
                            <>
                                <ul>
                                    {
                                        allThreads?.map((thread, idx) => (
                                            <li key={idx}>{thread.title}</li>
                                        )) 
                                        
                                    } 
                                </ul>
                            </>

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
                    <div style={{height: "96%"}}>
                        <button onClick={sidebarHandler} type="button">
                            <i class="fa-solid fa-bars-staggered"></i>
                        </button>

                        
                        <button style={{display: "flex", alignItems: "center", width: "100%", padding: "0.5rem", marginTop: "1.3rem"}} type="button">
                            <i class="fa-solid fa-pen-to-square fw-normal"></i>
                        </button>
                    </div>

                    <button className={styles.profile}>
                        <i class="fa-solid fa-regular fa-user text-white"></i>
                    </button>
                    
                </div>)
            }
        </div>
    )
}

export default Sidebar;