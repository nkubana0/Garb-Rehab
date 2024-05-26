import React from 'react'
import Hero from '../Components/Hero/hero'
import Popular from '../Components/popular/popular'
import Offers from '../Components/Offers/offers'
import NewCollections from '../Components/NewCollections/newCollections'
import NewsLetter from '../Components/newLetter/newsLetter'
import './css/shop.css'

const Shop = () => {
  return (
    <div className='shop'>
      <Hero />
      <Popular />
      <Offers />
      <NewCollections />
      <NewsLetter />
    </div>
  )
}

export default Shop