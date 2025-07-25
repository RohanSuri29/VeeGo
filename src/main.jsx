import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast'
import Context from './context/Context.jsx'
import SocketContext from './context/SocketContext.jsx'

createRoot(document.getElementById('root')).render(

  <Context>
   <SocketContext>
    <BrowserRouter>
        <App />
        <Toaster/>
      </BrowserRouter>
   </SocketContext>
  </Context>
)
