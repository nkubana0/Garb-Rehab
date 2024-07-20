import React from 'react';
import { Link } from 'react-router-dom';
import './offers.css';
import exclusive_image from '../Assets/exclusive.jpeg';

const Offers = () => {
  return (
    <div className='offers'>
      <div className="offers-left">
        <h1>Exclusive</h1>
        <h1>Offers For You</h1>
        <p>ONLY ON BEST SELLERS PRODUCTS</p>
        <Link to="/womens">
          <button>Check Now</button>
        </Link>
      </div>
      <div className="offers-right">
        <img src={exclusive_image} alt="Exclusive Offers" />
      </div>
    </div>
  );
};

export default Offers;
