import React from 'react'
import "./navbar.css"
import nav_logo from "../../assets/nav-logo.png"
import navProfile from "../../assets/nav-profile.svg"

const Navbar = () => {
  return (
    <div className='navbar'>
      <div className="logo-admin">
      <img src={nav_logo} alt="" className="nav-logo" />
      <h1>Admin Portal</h1>
      </div>
    </div>
  )
}

export default Navbar
