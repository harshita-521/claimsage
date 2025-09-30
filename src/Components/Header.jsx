import React from 'react'
import './Header.css'
import logo from '../assets/logo.png'
import logo1 from '../assets/image.png'
import logo11 from '../assets/logo11.png'


function Header() {
    return (
        <div className="header">
            <div className="logo"><img src={logo11} alt="logo" /></div>
            <div className='bot_name'>FUSION</div>
           
        </div>
    )
}

export default Header
