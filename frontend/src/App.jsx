import React from 'react'

import './App.css'
import './styles/theme.css'
import './styles/landing.css'
import './styles/chatbot.css'
import './styles/restaurant.css'
import AppRoutes from './routes/AppRoutes'
import Chatbot from './components/Chatbot'

function App() {
  return (
    <>
      <AppRoutes />
      <Chatbot />
    </>
  )
}

export default App
