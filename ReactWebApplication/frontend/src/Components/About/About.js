import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUtensils, faHome } from '@fortawesome/free-solid-svg-icons';
import "./About.css";

function Navbar() {
  return (
    <nav className="navbar">
      <ul>
        <li><FontAwesomeIcon icon={faHome} /><a href="/">Home</a></li>
      </ul>
      <ul>
        <li><FontAwesomeIcon icon={faShoppingCart} /><a href="/about">About</a></li>
      </ul>
      <ul>
        <li><FontAwesomeIcon icon={faShoppingCart} /><a href="/details">Orders</a></li>
      </ul>
      <ul>
        <li><FontAwesomeIcon icon={faShoppingCart} /><a href="/dailysale">Daily Sale</a></li>
      </ul>
      <ul>
        <li><FontAwesomeIcon icon={faShoppingCart} /><a href="/monthlysale">Monthly Sale</a></li>
      </ul>
      <ul>
        <li><FontAwesomeIcon icon={faUtensils} /><a href="/admin/fooditems">Food Items</a></li>
      </ul>
    </nav>
  );
}

function About() {
  return (
    <div>
      <Navbar />
      <div className="about-container">
        <h1>Hi Admin</h1>
        <ul>
          <li>You Can check Order and Payment Details in Orders ,</li>
          <li>View daily sales reports in Daily Sales ,</li>
          <li>View monthly sale reports in Monthly Sales  and</li>
          <li>Manage food items in Food items</li>
          {/* Add more features here */}
        </ul>
        <h2>Please Add Food Items Price</h2>
        <p>These Are the Trained Food Items. Please use these names for add food item prices.</p>
       

        <h2>Food Items</h2>
        <ul>
          <li>Egg</li>
          <li>White-Rice</li>
          <li>Fried-Rice</li>
          <li>Meat</li>
          <li>Noodles</li>
          <li>Fruit</li>
          <li>Pizza</li>
        </ul>
       
       
        <p>Ex:-</p>
        <p>Food item Name - Egg</p>
        <p>Price - 100</p>
       
      </div>
    </div>
  );
}

export default About;