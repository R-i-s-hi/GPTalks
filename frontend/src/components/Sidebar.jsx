import ThemeToggle from "../utils/ThemeToggle";
import styles from "../styles/Sidebar.module.css";
import { useAuth0 } from "@auth0/auth0-react";
import { useContext, useEffect, useState } from "react";
import { AllContext } from "../contexts/context";
import { v1 as uuidv1 } from "uuid";
import toast from "react-hot-toast";
import "../App.css";
import "../index.css";


function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    allFavThreads,
    setAllFavThreads,
    currThreadId,
    setCurrThreadId,
    newChat,
    setNewChat,
    prompt,
    setPrompt,
    reply,
    setReply,
    prevChats,
    setPrevChats,
    setLatestReply,
  } = useContext(AllContext);

  let [isOpen, setIsOpen] = useState(false);
  let [showFavChats, setShowFavChats] = useState(false);
  const { theme, toggleTheme } = ThemeToggle();
  const {
    isAuthenticated,
    loginWithRedirect: login,
    logout: auth0Logout,
    user,
  } = useAuth0();

  const signup = () => {
    login({ authorizationParams: { screen_hint: "signup" } })
  }
  const logout = () => {
    auth0Logout({ logoutParams: { returnTo: window.location.origin } });
  }

  // to get all chats
  const getAllThreads = async () => {
    try {
      const userId = user?.sub || null;
      const chats = await fetch(
        `http://localhost:5000/api/thread?userId=${userId}`,
        { method: "GET", credentials: "include" }
      );
      const res = await chats.json();
      const fillteredData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      setAllThreads(fillteredData);
    } catch (e) {
      console.log(`getAllThraeds error: ${e}`);
    }
  };
  const getAllFavThreads = async () => {
    try {
      const userId = user?.sub || null;
      const favChats = await fetch(
        `http://localhost:5000/api/favthread?userId=${userId}`,
        { method: "GET", credentials: "include" }
      );
      const res = await favChats.json();
      const favFillterdData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      setAllFavThreads(favFillterdData);
    } catch (e) {
      console.log(`getAllFavThraeds error: ${e}`);
    }
  };

  // to see chat
  const changeThread = async (threadId) => {
    setCurrThreadId(threadId); // the threadId of the new chat window set to the current thread
    setPrompt("");
    setReply(null);

    try {
      const response = await fetch(
        `http://localhost:5000/api/thread/${threadId}`
      );
      const data = await response.json();
      setPrevChats(data);
      setNewChat(false);
      await getAllThreads();
    } catch (e) {
      console.log(`changeThread error: ${e}`);
    }
  };
  const changeFavThread = async (threadId) => {
    setCurrThreadId(threadId); // the threadId of the new chat window set to the current thread
    setPrompt("");
    setReply(null);

    try {
      const response = await fetch(
        `http://localhost:5000/api/favthread/${threadId}`
      );
      const data = await response.json();
      console.log(data);
      setPrevChats(data);
      setNewChat(false);
    } catch (e) {
      console.log(`changeThread error: ${e}`);
    }
  };

  const deleteThread = async (threadId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/thread/${threadId}`, {
        method: "DELETE",
      });
      const data = await response.json();

      setAllThreads((prev) =>
        prev.filter((thread) => thread.threadId !== threadId)
      );

      if (currThreadId === threadId) {
        createNewChat();
      }

      if(response.status === 200) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }

    } catch (e) {
      console.log(`deleteThread error: ${e}`);
    }
  };

  const ArchieveChat = async (threadId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/favchat/${threadId}?ownerId=${user.sub}`,
        { method: "POST" }
      );
      const data = await response.json();

      if(response.status === 200) {
        toast.success(data.message);
      }
      else if(response.status === 409) {
        toast(data.message);
      }
      else {
        toast.error(data.message);
      }

      await getAllFavThreads();
    } catch (e) {
      console.log(`ArchieveChat error: ${e}`);
      toast.error("Something went wrong!");
    }
  };
  const UnarchieveChat = async (threadId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/favthread/${threadId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      
      if(response.status === 200) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }

      await getAllFavThreads();
    } catch (e) {
      console.log(`UnarchieveChat error: ${e}`);
    }
  };

  const sidebarHandler = () => {
    setIsOpen((prev) => !prev);
  };
  const FavChatHandler = () => {
    setShowFavChats((prev) => !prev);
  };
  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setLatestReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const guestId = localStorage.getItem("guestId");
    if (!guestId) return;

    fetch("http://localhost:5000/api/threads/transfer-ownership", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        fromGuestId: guestId,
        toUserId: user.sub,
      }),
    })
    .then(res => res.json())
    .then(res => {
      console.log(res)
      localStorage.removeItem("guestId")
    })
    .then(toast.success("User logedIn Successfully!"))
    .catch(err => console.error("Transfer failed:", err))

  }, [isAuthenticated, user])

  useEffect(() => {
    getAllThreads();
    getAllFavThreads();
  }, [allThreads, newChat]);



  return (
    <div>
      {isOpen ? (
        <div
          className={`${styles.sidebarContainer} ${
            !isOpen ? styles.offcanvas : ""
          }`}
        >
          <div className={styles.top}>
            <p className="mb-0 fs-4">
              <i class="fa-solid fa-hexagon-nodes"></i>
            </p>
            <button onClick={sidebarHandler} type="button">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div>
            <button
              onClick={createNewChat}
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                height: "2.5rem",
                marginTop: "1.3rem",
                paddingInlineStart: "1rem",
              }}
              type="button"
            >
              <i class="fa-solid fa-pen-to-square fw-normal"></i>
              <p className="mb-0 ms-2">New chat</p>
            </button>
          </div>

          {showFavChats ? (
            <div className={styles.tagLine}>Archieved chats</div>
          ) : (
            <div className={styles.tagLine}>All chats</div>
          )}
          <hr style={{ border: "1px solid #d3cfcf3e", marginTop: "0.5rem" }} />
          <div className={styles.main}>
            {showFavChats ? (
              <>
                <ul>
                  {allFavThreads.length > 0 ? (
                    allFavThreads.map((thread, idx) => (
                      <li
                        className={
                          thread.threadId === currThreadId
                            ? styles.highlighted
                            : " "
                        }
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                        key={idx}
                        onClick={() => {
                          changeFavThread(thread.threadId);
                        }}
                      >
                        <span style={{ maxWidth: "170px" }}>
                          {thread.title}
                        </span>
                        <span class="d-flex align-items-center cursor-pointer btn-group">
                          <i
                            class="fa-solid fa-ellipsis btn btn-sm dropdown-toggle"
                            id={styles.optnBtn}
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          ></i>
                          <ul
                            class="dropdown-menu"
                            style={{ padding: "0.4rem" }}
                          >
                            <li
                              class="dropdown-item"
                              style={{ fontSize: "0.8rem", marginTop: "0" }}
                              onClick={
                                isAuthenticated
                                  ? (e) => {
                                      e.stopPropagation();
                                      UnarchieveChat(thread.threadId);
                                      const dropdown = document.querySelector(
                                        ".dropdown-menu.show"
                                      );
                                      if (dropdown) {
                                        dropdown.classList.remove("show");
                                      }
                                    }
                                  : signup
                              }
                            >
                              <i
                                class="fa-solid fa-box-open"
                                style={{ marginRight: "0.4rem" }}
                              ></i>{" "}
                              Unarchieve
                            </li>
                            <li
                              class="dropdown-item"
                              style={{ fontSize: "0.8rem", marginTop: "0" }}
                              onClick={
                                isAuthenticated
                                  ? (e) => {
                                      e.stopPropagation();
                                      deleteThread(thread.threadId);
                                      const dropdown = document.querySelector(
                                        ".dropdown-menu.show"
                                      );
                                      if (dropdown) {
                                        dropdown.classList.remove("show");
                                      }
                                    }
                                  : signup
                              }
                            >
                              <i
                                class="fa-solid fa-trash"
                                style={{ marginRight: "0.4rem" }}
                              ></i>{" "}
                              Delete
                            </li>
                          </ul>
                        </span>
                      </li>
                    ))
                  ) : (
                    <p
                      class="d-flex justify-content-center text-center"
                      style={{ cursor: "default" }}
                    >
                      No Archieved chats
                    </p>
                  )}
                </ul>
              </>
            ) : (
              <>
                <ul>
                  {allThreads.length > 0 ? (
                    allThreads?.map((thread, idx) => (
                      <li
                        className={
                          thread.threadId === currThreadId
                            ? styles.highlighted
                            : " "
                        }
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                        key={idx}
                        onClick={() => {
                          changeThread(thread.threadId);
                        }}
                      >
                        <span style={{ maxWidth: "170px" }}>
                          {thread.title}
                        </span>
                        {
                          isAuthenticated ? 
                          
                          (
                            <span className="d-flex align-items-center cursor-pointer btn-group">
                          <i
                            class="fa-solid fa-ellipsis btn btn-sm dropdown-toggle"
                            id={styles.optnBtn}
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            data-bs-auto-close="true"
                          ></i>
                          <ul
                            class="dropdown-menu"
                            style={{ padding: "0.4rem" }}
                          >
                            <li
                              class="dropdown-item"
                              style={{ fontSize: "0.8rem", marginTop: "0" }}
                              onClick={
                                isAuthenticated
                                  ? (e) => {
                                      e.stopPropagation();

                                      ArchieveChat(thread.threadId);
                                      const dropdown = document.querySelector(
                                        ".dropdown-menu.show"
                                      );
                                      if (dropdown) {
                                        dropdown.classList.remove("show");
                                      }
                                    }
                                  : signup
                              }
                            >
                              <i
                                class="fa-solid fa-box"
                                style={{ marginRight: "0.4rem" }}
                              ></i>{" "}
                              Archieve
                            </li>
                            <li
                              class="dropdown-item"
                              style={{ fontSize: "0.8rem", marginTop: "0" }}
                              onClick={
                                isAuthenticated
                                  ? (e) => {
                                      e.stopPropagation();
                                      deleteThread(thread.threadId);
                                      const dropdown = document.querySelector(
                                        ".dropdown-menu.show"
                                      );
                                      if (dropdown) {
                                        dropdown.classList.remove("show");
                                      }
                                    }
                                  : signup
                              }
                            >
                              <i
                                class="fa-solid fa-trash"
                                style={{ marginRight: "0.4rem" }}
                              ></i>{" "}
                              Delete
                            </li>
                          </ul>
                        </span>
                          ) : (
                          <></>
                          )
                        }
                      </li>
                    ))
                  ) : (
                    <p
                      class="d-flex justify-content-center text-center"
                      style={{ cursor: "default" }}
                    >
                      No chats yet
                    </p>
                  )}
                </ul>
              </>
            )}
          </div>

          <hr
            className="mt-1 mb-1"
            style={{ border: "0.5px solid var(--text-color)", opacity: 0.1 }}
          ></hr>

          <div>
            {showFavChats ? (
              <button
                className={styles.bottomBtn1}
                onClick={isAuthenticated ? FavChatHandler : signup}
              >
                <i class="fa-solid fa-list-ul ps-2"></i>
                <p className="mb-0 ms-3">All Chats</p>
              </button>
            ) : (
              <button
                className={styles.bottomBtn2}
                onClick={isAuthenticated ? FavChatHandler : signup}
              >
                <i class="fa-regular fa-star ps-2"></i>
                <p className="mb-0 ms-3">Archieves</p>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.sidebarContainerClosed}>
          <div style={{ height: "96%" }}>
            <button onClick={sidebarHandler} type="button">
              <i className="fa-solid fa-bars-staggered"></i>
            </button>

            <button
              onClick={createNewChat}
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                padding: "0.5rem",
                marginTop: "1.3rem",
              }}
              type="button"
            >
              <i class="fa-solid fa-pen-to-square fw-normal"></i>
            </button>
          </div>

          <button id={styles.profile}>
            <i
              class="fa-solid fa-regular fa-user text-white dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            ></i>
            <ul
              class="dropdown-menu"
              style={{
                padding: "0.4rem",
                backgroundColor: "var(--sidebar-color)",
                border: "1px solid #d3cfcf3e",
              }}
            >
              {isAuthenticated ? (
                <>
                  <div
                    class="d-flex gap-3 align-items-center justify-content-between dropdown-header"
                    style={{ cursor: "default" }}
                  >
                    <img
                      src={user.picture}
                      height="34px"
                      width="34px"
                      style={{ borderRadius: "18px" }}
                    ></img>

                    <div
                      class="d-flex flex-column"
                      style={{ color: "var(--text-color)" }}
                    >
                      <p class="mb-0" style={{ fontSize: "0.8rem" }}>
                        {user.name}
                      </p>
                      <p
                        class="mb-0"
                        style={{ fontSize: "0.7rem", opacity: "0.7" }}
                      >
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <hr
                    class="dropdown-divider mx-2"
                    style={{ border: "1px solid #d3cfcf3e" }}
                  />
                </>
              ) : (
                <></>
              )}

              <li
                class="dropdown-item"
                onClick={toggleTheme}
                style={{ fontSize: "0.8rem", marginTop: "0" }}
              >
                {theme == "light" ? (
                  <span
                    class="d-flex align-items-center"
                    style={{ fontSize: "12px" }}
                  >
                    <i
                      className="lni lni-moon-half-right-5 mb-0"
                      style={{ marginRight: "0.4rem", fontSize: "14px" }}
                    ></i>{" "}
                    Dark mode
                  </span>
                ) : (
                  <span
                    class="d-flex align-items-center"
                    style={{ fontSize: "12px" }}
                  >
                    <i
                      class="lni lni-sun-1 mb-0"
                      style={{ marginRight: "0.4rem", fontSize: "14px" }}
                    ></i>{" "}
                    Light mode
                  </span>
                )}
              </li>
              <li
                class="dropdown-item"
                onClick={isAuthenticated ? logout : signup}
                style={{ fontSize: "0.8rem", marginTop: "0" }}
              >
                <span style={{ fontSize: "12px" }}>
                  {isAuthenticated ? (
                    <>
                      <i
                        class="fa-solid fa-arrow-right-from-bracket"
                        style={{ marginRight: "0.4rem" }}
                      ></i>{" "}
                      Logout
                    </>
                  ) : (
                    <>
                      <i
                        class="fa-solid fa-arrow-right-to-bracket"
                        style={{ marginRight: "0.4rem" }}
                      ></i>{" "}
                      Signup / Login
                    </>
                  )}
                </span>
              </li>
            </ul>
          </button>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
