import React, { useContext } from "react";
import "./productDisplay.css";
import star_icon from "../Assets/star_icon.png";
import star_dull from "../Assets/star_dull_icon.png";
import { ShopContext } from "../../Context/context";

const ProductDisplay = (props) => {
  const { product } = props;
  const { addToCart } = useContext(ShopContext);

  if (!product) {
    return <div>Loading...</div>; // or any fallback UI
  }

  return (
    <div className="product-display">
      <div className="display-left">
        <div className="display-image-list">
          <img src={product.image} alt="product" />
          <img src={product.image} alt="product" />
          <img src={product.image} alt="product" />
        </div>
        <div className="product-display-image">
          <img className="display-main" src={product.image} alt="product" />
        </div>
      </div>
      <div className="display-right">
        <h1>{product.name}</h1>
        <div className="display-right-star">
          <img src={star_icon} alt="star" />
          <img src={star_icon} alt="star" />
          <img src={star_icon} alt="star" />
          <img src={star_icon} alt="star" />
          <img src={star_dull} alt="dull star" />
          <p>(122)</p>
        </div>
        <div className="right-prices">
          <div className="right-old-price">${product.old_price}</div>
          <div className="right-new-price">${product.new_price}</div>
        </div>
        <div className="right-description">
          Dress to impress or, at the very least, to distract from the fact that
          you are an emotional rollercoaster in human form. Our clothes might not
          fix your problems, but they will definitely make you look like you are
          handling them with style."
        </div>
        <button onClick={() => addToCart(product.id)}>Add To Cart</button>
        <p className="right-category">
          <span>Category :</span> Women, Tshirt, Crop-Top
        </p>
        <p className="right-category">
          <span>Tags :</span> Modern, Latest
        </p>
      </div>
    </div>
  );
};

export default ProductDisplay;
