import React, { useContext, useRef, useState } from "react";
import "./navbar.css";
import logo from "../Assets/logo.png";
import cart from "../Assets/cart_icon.png";
import { Link } from "react-router-dom";
import { ShopContext } from "../../Context/context";
import drop_down from "../Assets/dropdown_icon.png";

const Navbar = () => {
  const [menu, setMenu] = useState("shop");
  const { getTotalCartItems } = useContext(ShopContext);
  const menuRef = useRef();

  const dropDownToggle = (e) => {
    menuRef.current.classList.toggle("nav-menu-responsive-visible");
    e.target.classList.toggle("open");
  };

  return (
    <>
      <div className="navbar">
        <div className="nav-logo">
          <Link to="/">
            <img src={logo} alt="Logo" />
          </Link>
        </div>
        <ul ref={menuRef} className="nav-menu">
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
              to="/offers"
            >
              Offers
            </Link>
            {menu === "mens" ? <hr /> : <></>}
          </li>
          <li
            onClick={() => {
              setMenu("latest");
            }}
          >
            <Link
              style={{ textDecoration: "none", color: "rgb(216, 215, 210)" }}
              to="/latest"
            >
              Latest
            </Link>{" "}
            {menu === "latest" ? <hr /> : <></>}
          </li>
          <li
            onClick={() => {
              setMenu("sneakers");
            }}
          >
            <Link
              style={{ textDecoration: "none", color: "rgb(216, 215, 210)" }}
              to="/sneakers"
            >
              Sneakers
            </Link>{" "}
            {menu === "sneakers" ? <hr /> : <></>}
          </li>
        </ul>
        <div className="nav-login-cart">
        <img
          className="nav-drop-down"
          onClick={dropDownToggle}
          src={drop_down}
          alt=""
        />
          {localStorage.getItem("auth-token") ? (
            <button
              onClick={() => {
                localStorage.removeItem("auth-token");
                window.location.replace("/");
              }}
            >
              Log Out
            </button>
          ) : (
            <Link to="/login">
              <button>Login</button>
            </Link>
          )}
          <Link to="/cart">
            <img src={cart} alt="" />
          </Link>
          <div className="nav-cart-count">{getTotalCartItems()}</div>
        </div>
      </div>
      <div>
        <ul ref={menuRef} className="nav-menu-responsive">
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
              setMenu("offers");
            }}
          >
            <Link
              style={{ textDecoration: "none", color: "rgb(216, 215, 210)" }}
              to="/offers"
            >
              Offers
            </Link>
            {menu === "Offers" ? <hr /> : <></>}
          </li>
          <li
            onClick={() => {
              setMenu("latest");
            }}
          >
            <Link
              style={{ textDecoration: "none", color: "rgb(216, 215, 210)" }}
              to="/latest"
            >
              Latest
            </Link>{" "}
            {menu === "Latest" ? <hr /> : <></>}
          </li>
          <li
            onClick={() => {
              setMenu("kids");
            }}
          >
            <Link
              style={{ textDecoration: "none", color: "rgb(216, 215, 210)" }}
              to="/sneakers"
            >
              Sneakers
            </Link>{" "}
            {menu === "Sneakers" ? <hr /> : <></>}
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
