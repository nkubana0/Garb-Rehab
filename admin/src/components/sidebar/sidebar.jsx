import React from 'react'
import './sidebar.css'
import {Link} from 'react-router-dom'
import add_product from '../../assets/add.png'
import list_product from '../../assets/list.png'

const Sidebar = () => {
  return (
    <div className='sidebar'>
        <Link to= {'/addproduct'} style={{textDecoration: "none"}}>
            <div className="sidebar-item">
                <img src={add_product} alt="" />
                <p>Add Product</p>
            </div>
        </Link>
        <Link to= {'/listproduct'} style={{textDecoration: "none"}}>
            <div className="sidebar-item">
                <img src={list_product} alt="" />
                <p>Product List</p>
            </div>
        </Link>
    </div>
  )
}

export default Sidebar