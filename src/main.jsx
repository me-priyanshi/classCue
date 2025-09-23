import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import './styles/theme.css'
import App from './App.jsx'
import './utils/registerSW'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
