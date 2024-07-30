import React, { useContext } from "react";
import "./css/shopCategory.css";
import { ShopContext } from "../Context/context";
//import dropdown_icon from "../Components/Assets/dropdown_icon.svg";
import Item from "../Components/item/item";

const ShopCategory = (props) => {
  const { all_products } = useContext(ShopContext);
  return (
    <div className="shop-category">
      <div className="shopcategory-products">
        {all_products.map((item, i) => {
          if (props.category === item.category) {
            return (
              <Item
                key={i}
                id={item.id}
                name={item.name}
                image={item.image}
                new_price={item.new_price}
                old_price={item.old_price}
              />
            );
          }
          else {
            return null;
          }
        })}
      </div>
    </div>
  );
};

export default ShopCategory;
