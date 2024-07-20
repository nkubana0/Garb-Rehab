import React, { useContext, useState } from "react";
import "./cartitems.css";
import { ShopContext } from "../../Context/context";
import remove_icon from "../Assets/cart_cross_icon.png";
import FlutterwavePayment from "../FlutterwavePayment";

const CartItems = () => {
  const { getTotalCartAmount, all_products, cartItems, removeFromCart, clearCart } = useContext(ShopContext);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");

  if (!all_products || !cartItems) {
    return <div>Loading...</div>;
  }

  const productsInCart = all_products.filter(product => cartItems[product.id] > 0);

  const handlePromoSubmit = () => {
    if (promoCode === "DISCOUNT10") {
      setDiscount(0.1);
      setPromoError("");
      alert("Promo code applied successfully! You received a 10% discount.");
    } else if (promoCode === "DISCOUNT20") {
      setDiscount(0.2);
      setPromoError("");
      alert("Promo code applied successfully! You received a 20% discount.");
    } else if (promoCode === "DISCOUNT15") {
      setDiscount(0.15);
      setPromoError("");
      alert("Promo code applied successfully! You received a 15% discount.");
    } else {
      setDiscount(0);
      setPromoError("Invalid promo code");
      alert("Invalid promo code. Please try again.");
    }
  };

  const getDiscountedTotal = () => {
    const total = getTotalCartAmount();
    return total - total * discount;
  };

  const handlePaymentSuccess = (response) => {
    alert("Payment successful! Transaction reference: " + response.tx_ref);
    clearCart(); // Clear the cart after successful payment
  };

  const handlePaymentFailure = (error) => {
    alert("Payment failed. Please try again.");
    console.error("Payment failed:", error);
  };

  const handleCashOnDelivery = () => {
    alert("Order placed successfully. Please pay on delivery.");
    clearCart(); // Clear the cart after selecting cash on delivery
  };

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
      {productsInCart.map((product) => (
        <div key={product.id}>
          <div className="format format-main">
            <img className="product-icon" src={product.image} alt={product.name} />
            <p>{product.name}</p>
            <p>${product.new_price}</p>
            <button className="quantity">{cartItems[product.id]}</button>
            <p>${product.new_price * cartItems[product.id]}</p>
            <img
              className="remove-icon"
              src={remove_icon}
              onClick={() => removeFromCart(product.id)}
              alt="Remove"
            />
          </div>
          <hr />
        </div>
      ))}
      <div className="cart-items-down">
        <div className="cart-items-total">
          <h1>Cart Total</h1>
          <div>
            <div className="total-items">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="total-items">
              <p>Discount</p>
              <p>${(getTotalCartAmount() * discount).toFixed(2)}</p>
            </div>
            <hr />
            <div className="total-items">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="total-items">
              <h3>Total</h3>
              <h3>${getDiscountedTotal().toFixed(2)}</h3>
            </div>
          </div>
          <div className="payments">
          <FlutterwavePayment
            amount={getDiscountedTotal().toFixed(2)}
            onSuccess={handlePaymentSuccess}
            onFailure={handlePaymentFailure}
          />
          <button onClick={handleCashOnDelivery}>Cash on Delivery</button>
          </div>
        </div>
        <div className="promo">
          <p>If you have a promo code, Enter it here</p>
          <div className="promo-box">
            <input
              type="text"
              placeholder="Promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <button onClick={handlePromoSubmit}>Submit</button>
            {promoError && <p className="error">{promoError}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
