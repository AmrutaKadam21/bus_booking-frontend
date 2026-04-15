import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "leaflet/dist/leaflet.css";
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
// import { SearchProvider } from './context/SearchContext.jsx'

createRoot(document.getElementById('root')).render(
       <BrowserRouter>
              {/* <SearchProvider> */}
                     <App />
              {/* </SearchProvider> */}
       </BrowserRouter>
)
