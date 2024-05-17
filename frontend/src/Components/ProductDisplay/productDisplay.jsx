import React, { useContext } from "react";
import "./productDisplay.css";
import star_icon from "../Assets/star_icon.png";
import star_dull from "../Assets/star_dull_icon.png";
import { ShopContext } from "../../Context/context";

const ProductDisplay = (props) => {
  const { product } = props;
  const {addToCart} = useContext(ShopContext);
  return (
    <div className="product-display">
      <div className="display-left">
        <div className="display-image-list">
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
        </div>
        <div className="product-display-image">
          <img className="display-main" src={product.image} alt="" />
        </div>
      </div>
      <div className="display-right">
        <h1>{product.name}</h1>
        <div className="display-right-star">
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_dull} alt="" />
          <p>(122)</p>
        </div>
        <div className="right-prices">
          <div className="right-old-price">${product.old_price}</div>
          <div className="right-new-price">${product.new_price}</div>
        </div>
        <div className="right-description">
          Lore Epsom dolor sit amet, consectetur adipiscing elit. Fusce
          hendrerit, nulla ut sollicitudin porta, odio leo vehicula lectus, sit
          amet condimentum ipsum libero id magna.
        </div>
        <div className="display-right-size">
            <h1>Select Size</h1>
            <div className="right-size">
                <div>S</div>
                <div>M</div>
                <div>L</div>
                <div>XL</div>
                <div>XXL</div>
            </div>
        </div>
        <button onClick={()=> {addToCart(product.id)}}>Add To Cart</button>
        <p className="right-category"><span>Category :</span>Women, Tshirt, Crop-Top</p>
        <p className="right-category"><span>Tags :</span>Modern, Latest</p>
      </div>
    </div>
  );
};

export default ProductDisplay;
