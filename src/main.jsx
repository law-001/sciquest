import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LessonsDataProvider } from './context/LessonsDataContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LessonsDataProvider>
      <App />
    </LessonsDataProvider>
  </StrictMode>,
)
