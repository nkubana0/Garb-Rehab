import React, { useContext } from "react";
import { ShopContext } from "../Context/context";
import { useParams } from "react-router-dom";
import Breadcrumb from "../Components/Breadcrumbs/breadcrumbs";
import ProductDisplay from "../Components/ProductDisplay/productDisplay";
import Description from "../Components/DescriptionBox/description";
import Related from "../Components/RelatedProducts/related";
import './css/cart.css'

const Product = () => {
  const { all_products } = useContext(ShopContext);
  const { productId } = useParams();
  const product = all_products.find((e) => e.id === Number(productId));

  return <div className="product">
    <Breadcrumb product={product}/>
    <ProductDisplay product={product}/>
    <Description />
    <Related />
  </div>;
};

export default Product;
