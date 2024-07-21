import React from "react";
import "./breadcrumb.css";
import arrow_icon from "../Assets/breadcrum_arrow.png";

const Breadcrumb = (props) => {
  const { product } = props;

  if (!product || !product.category || !product.name) {
    return <div className="breadcrumbs">Loading...</div>; // or any fallback UI
  }

  return (
    <div className="breadcrumbs">
      HOME <img src={arrow_icon} alt="arrow icon" /> SHOP <img src={arrow_icon} alt="arrow icon" />{" "}
      {product.category} <img src={arrow_icon} alt="arrow icon" /> {product.name}
    </div>
  );
};

export default Breadcrumb;
