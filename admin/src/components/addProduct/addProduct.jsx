import React, { useState } from "react";
import "./addproduct.css";
import upload_area from "../../assets/upload_area.svg";

const AddProduct = () => {
  const initialProductDetails = {
    name: "",
    image: "",
    category: "women",
    new_price: "",
    old_price: "",
  };

  const [image, setImage] = useState(false);
  const [productDetails, setProductDetails] = useState(initialProductDetails);

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const Add_Product = async () => {
    console.log(productDetails);
    let responseData;
    let product = productDetails;

    let formData = new FormData();
    formData.append("product", image);

    await fetch("http://localhost:4000/upload", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    })
      .then((resp) => resp.json())
      .then((data) => {
        responseData = data;
      });

    if (responseData.success) {
      product.image = responseData.image_url;
      console.log(product);
      await fetch("http://localhost:4000/addproduct", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      })
        .then((resp) => resp.json())
        .then((data) => {
          if (data.success) {
            alert("Product Added");
            // Reset form and image
            setProductDetails(initialProductDetails);
            setImage(false);
          } else {
            alert("Failed");
          }
        });
    }
  };

  return (
    <div className="add-product">
      <div className="addproduct-item">
        <p>Product Title</p>
        <input
          value={productDetails.name}
          onChange={changeHandler}
          type="text"
          name="name"
          placeholder="Type Here!"
        />
      </div>
      <div className="price addproduct-item">
        <div className="item-fields">
          <p>Price</p>
          <input
            value={productDetails.old_price}
            onChange={changeHandler}
            type="number"
            name="old_price"
            placeholder="Type here!"
          />
        </div>
        <div className="item-fields">
          <p>Offer Price</p>
          <input
            value={productDetails.new_price}
            onChange={changeHandler}
            type="number"
            name="new_price"
            placeholder="Type here!"
          />
        </div>
      </div>
      <div className="addproduct-item">
        <p>Product Category</p>
        <select
          value={productDetails.category}
          onChange={changeHandler}
          name="category"
          className="add-product-selector"
        >
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kids</option>
        </select>
      </div>
      <div className="addproduct-item">
        <label htmlFor="file-input">
          <img
            src={image ? URL.createObjectURL(image) : upload_area}
            alt=""
            className="thumbnail-img"
          />
        </label>
        <input
          onChange={imageHandler}
          type="file"
          name="image"
          id="file-input"
          hidden
        />
      </div>
      <button onClick={Add_Product} className="addproduct-btn">
        ADD
      </button>
    </div>
  );
};

export default AddProduct;
