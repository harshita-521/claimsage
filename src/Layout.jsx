import React from 'react'
import Header from './Components/Header'
import Chat from './Components/Chat'
import Footer from './Components/Footer'
import { Outlet } from 'react-router-dom'
// import './Layout.css'

function Layout() {
  return (
    <>
    <Header/>
    <Outlet/>
    {/* <Footer/> */}
    </>
  )
}

export default Layout
