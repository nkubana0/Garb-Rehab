import React, { useContext } from "react";
import "./cartitems.css";
import { ShopContext } from "../../Context/context";
import remove_icon from "../Assets/cart_cross_icon.png";

const CartItems = () => {
  const { getTotalCartAmount, all_products, cartItems, removeFromCart} = useContext(ShopContext);

  if (!all_products || !cartItems) {
    return <div>Loading...</div>;
  }

  const productsInCart = all_products.filter(
    (product) => cartItems[product.id] > 0
  );

  return (
    <div className="cartitems">
      <div className="format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      {productsInCart.map((e) => (
        <div key={e.id}>
          <div className="format format-main">
            <img className="product-icon" src={e.image} alt={e.name} />
            <p>{e.name}</p>
            <p>${e.new_price}</p>
            <button className="quantity">{cartItems[e.id]}</button>
            <p>${e.new_price * cartItems[e.id]}</p>
            <img
              className="remove-icon"
              src={remove_icon}
              onClick={() => removeFromCart(e.id)}
              alt="Remove"
            />
          </div>
          <hr />
        </div>
      ))}
      <div className="cart-items-down">
        <div className="cart-items-total">
          <h1>Cart Totals</h1>
          <div>
            <div className="total-items">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="total-items">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="total-items">
              <h3>Total</h3>
              <h3>${getTotalCartAmount()}</h3>
            </div>
          </div>
          <button>PROCEED TO CHECKOUT</button>
        </div>
        <div className="promo">
          <p>If you have a promo code, Enter it here</p>
          <div className="promo-box">
            <input type="text" placeholder="promo code" />
            <button>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
