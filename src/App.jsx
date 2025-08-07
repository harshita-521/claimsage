import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './Components/Login'
import SignUp from './Components/SignUp'
import Chat from './Components/Chat'
import Header from './Components/Header'
import Layout from './Layout'

function App() {
  return (
    // <Router>
    //   <Routes>
    //     <Route path="/login" element={<LoginPage />} />
    //     <Route path="/signUp" element={<SignUp />} />
    //     <Route path="/chat" element={<Chat />} />
    //     <Route path="/" element={<Navigate to="/login" replace />} />
    //   </Routes>
    // </Router>

    <Layout/>
  )
}

export default App
