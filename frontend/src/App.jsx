import './App.css'
import Sidebar from './components/Sidebar'
import ChatWindow from './components/ChatWindow'
import {AllContext} from "./contexts/context.jsx"

function App() {
  const providerValues = {};

  return (
    <div className='rootComponent'>
      <AllContext.Provider values={providerValues} >
        <Sidebar />
        <ChatWindow />
      </AllContext.Provider>
    </div>
  )
}

export default App
