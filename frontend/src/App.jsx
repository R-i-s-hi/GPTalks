import './App.css'
import Sidebar from './components/Sidebar'
import ChatWindow from './components/ChatWindow'
import {AllContext} from "./contexts/context.jsx"
import { useState } from 'react'
import {v1 as uuidv1} from "uuid"

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1())
  const [isLoader, setIsLoader] = useState(false);
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [allFavThreads, setAllFavThreads] = useState([]);

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    isLoader, setIsLoader,
    prevChats, setPrevChats,
    newChat, setNewChat,
    allThreads, setAllThreads,
    allFavThreads, setAllFavThreads,
  };

  return (
    <div className='rootComponent'>
      <AllContext.Provider value={providerValues} >
        <Sidebar />
        <ChatWindow />
      </AllContext.Provider>
    </div>
  )
}

export default App
