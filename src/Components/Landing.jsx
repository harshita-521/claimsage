import React from 'react'
import { NavLink } from 'react-router-dom'
import './Landing.css'

function Landing() {
  return (
    <div className='Landing_page'>
      <div className="entry">
        <div className="entry1">Upload.</div>
        <div className="entry2">Ask.</div>
        <div className="entry3">Understand</div>
        </div>
      <div className="text_landing">Got Questions? Your Policies Have Answers (We’ll Find Them)</div>
       <div className="auth">
                <button>
                <NavLink
                to="/login"
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    Login
                </NavLink>
            </button><button>
                <NavLink
                to="/signUp"
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    SignUp
                </NavLink>
           </button>

            </div>
    </div>
  )
}

export default Landing
