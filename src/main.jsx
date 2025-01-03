import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import StoreContextProvider from './components/Customer/context/StoreContext.jsx'
import { SidebarProvider } from "./components/Admin/Dashboard/context/SidebarContext.jsx";


ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <StoreContextProvider>
            <SidebarProvider>
                <App />
            </SidebarProvider>
        </StoreContextProvider>
    </BrowserRouter>
)
