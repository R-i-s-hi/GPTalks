import './App.css'
import Sidebar from './components/Sidebar'
import ChatWindow from './components/ChatWindow'
import {AllContext} from "./contexts/context.jsx"
import { useState, useEffect } from 'react'
import {v1 as uuidv1} from "uuid"
import { Toaster } from 'react-hot-toast';

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1())
  const [isLoader, setIsLoader] = useState(false);
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [allFavThreads, setAllFavThreads] = useState([]);
  const [latestReply, setLatestReply] = useState(null);

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    isLoader, setIsLoader,
    prevChats, setPrevChats,
    newChat, setNewChat,
    allThreads, setAllThreads,
    allFavThreads, setAllFavThreads,
    latestReply, setLatestReply,
  };
  return (
    <div className='rootComponent'>
      <AllContext.Provider value={providerValues} >
        <Sidebar />
        <Toaster toastOptions={{
          
          duration: 2000,
          style:{zIndex: "9999"},
          success: {
            duration: 2000,
          }
          }} />
        <ChatWindow />
      </AllContext.Provider>
    </div>
  )
}

export default App
