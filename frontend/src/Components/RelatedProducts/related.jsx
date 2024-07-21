import React, { useEffect, useState } from "react";
import "./related.css";
import Item from "../item/item";

const Related = () => {
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    fetch("https://garb-rehab-backend.onrender.com/popularinwomen")
      .then((response) => response.json())
      .then((data) => setRelatedProducts(data))
      .catch((error) => console.error('Error fetching related products:', error));
  }, []);

  return (
    <div className="related">
      <h1>Related Products</h1>
      <hr />
      <div className="related-item">
        {relatedProducts.map((item, i) => (
          <Item
            key={i}
            id={item.id}
            name={item.name}
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>
    </div>
  );
};

export default Related;
