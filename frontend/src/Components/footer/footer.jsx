import React, { useRef, useState } from "react";
import './footer.css'
import footer_logo from "../Assets/logo.png";
import instagram_icon from '../Assets/instagram_icon.png'
import pintrest from '../Assets/pintester_icon.png'
import whatsapp_icon from '../Assets/whatsapp_icon.png'
import "../Navbar/navbar.css";
import { Link } from "react-router-dom";

const Footer = () => {
        const [menu, setMenu] = useState("shop");
        const menuRef = useRef();
      
  return (
    <div className='footer'>
        <div className="footer-logo">
            <img src={footer_logo} alt="" />
        </div>
        <ul className="footer-links">
        <div className="navbar">
        <div className="nav-logo">
        </div>
        <ul ref={menuRef} className="footer-menu">
          <li
            onClick={() => {
              setMenu("shop");
            }}
          >
            <Link
              style={{ textDecoration: "none", color: "rgb(216, 215, 210)" }}
              to="/"
            >
              Home
            </Link>{" "}
            {menu === "shop" ? <hr /> : <></>}
          </li>
          <li
            onClick={() => {
              setMenu("mens");
            }}
          >
            <Link
              style={{ textDecoration: "none", color: "rgb(216, 215, 210)" }}
              to="/mens"
            >
              Men
            </Link>
            {menu === "mens" ? <hr /> : <></>}
          </li>
          <li
            onClick={() => {
              setMenu("womens");
            }}
          >
            <Link
              style={{ textDecoration: "none", color: "rgb(216, 215, 210)" }}
              to="/womens"
            >
              Women
            </Link>{" "}
            {menu === "womens" ? <hr /> : <></>}
          </li>
          <li
            onClick={() => {
              setMenu("kids");
            }}
          >
            <Link
              style={{ textDecoration: "none", color: "rgb(216, 215, 210)" }}
              to="/kids"
            >
              Kids
            </Link>{" "}
            {menu === "kids" ? <hr /> : <></>}
          </li>
        </ul>
      </div>
        </ul>
        <div className="footer-social-icon">
            <div className="footer-icons-container">
                <img src={instagram_icon} alt="" />
            </div>
            <div className="footer-icons-container">
                <img src={pintrest} alt="" />
            </div>
            <div className="footer-icons-container">
                <img src={whatsapp_icon} alt="" />
            </div>
        </div>
        <div className="footer-copyright">
            <hr />
            <p>Copyright @ 2024 - All rights reserved</p>
        </div>
    </div>
  )
}

export default Footer