

import React, { useEffect, useState } from 'react';
import Payment from '../Payment/Payment';
import axios from 'axios'; 
import { getDatabase, ref, push, update } from "firebase/database";
import { app } from '../../firebaseConfig.js';
import "./TotalBill.css"



const TotalBill = ({ detectedItems }) => {
    const [orderConfirmed, setOrderConfirmed] = useState(false);
    const [referenceNumber, setReferenceNumber] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [foodItemPrices, setFoodItemPrices] = useState({});
    const [phoneNumberError, setPhoneNumberError] = useState('');



    useEffect(() => {
        const fetchFoodItemPrices = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/food-items');
                const prices = {};
                // Convert array of food items to object for easier lookup
                response.data.forEach(item => {
                    prices[item.name] = item.price;
                });
                setFoodItemPrices(prices);
                console.log('Food Item Prices:', prices); // Log food item prices
            } catch (error) {
                console.error('Error fetching food item prices:', error);
            }
        };

        fetchFoodItemPrices();

        // Clear saved phone number when component mounts
        setPhoneNumber('');
    }, []); // Empty dependency array ensures the effect runs only once on component mount

    const calculateTotalBill = (detectedItems) => {
        let bill = 0;
        detectedItems.forEach(item => {
            const price = foodItemPrices[item.name] || 0; // Access price from foodItemPrices state
            bill += price * item.quantity;
        });
        return bill.toFixed(2);
    };

    const totalBill = calculateTotalBill(detectedItems);

    const generateReferenceNumber = () => {
        const prefix = 'REF-';
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().replace(/[-:]/g, '').slice(0, -5);
        const numericString = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return prefix + formattedDate + numericString;
    };












    const handleConfirmClick = async () => {
       
       
       // Validate phone number
    if (!validatePhoneNumber()) {
        return; // Exit function if phone number is invalid
    }
       
       
        try {
            const referenceNum = generateReferenceNumber();
            setReferenceNumber(referenceNum);

            // Construct order data including phone number
            const orderData = {
                detectedItems,
                totalBill,
                referenceNumber: referenceNum,
                orderDateTime: new Date().toISOString(),
                phoneNumber, // Include phone number in order data
            };

            // Send order data to MongoDB via backend
            const response = await axios.post('http://localhost:4000/api/orders', orderData);

            // Log response from MongoDB
            console.log("Response from MongoDB:", response.data);

            // Send order data to Firebase Realtime Database
            const database = getDatabase(app);
            const ordersRef = ref(database, 'orders');
            const newOrderRef = push(ordersRef);
            await update(newOrderRef, orderData);

            // Log order details and mark order as confirmed
            console.log("Order data sent to Firebase Realtime Database:", orderData);
            console.log("Order Confirmed");
            setOrderConfirmed(true);
        } catch (error) {
            console.error('Error confirming order:', error);
            // Display an error message to the user
        }
    };



    const validatePhoneNumber = () => {
        const phoneRegex = /^\d{10}$/;
        if (!phoneNumber.trim()) {
            setPhoneNumberError('Please enter your phone number.');
            return false;
        }
        if (!phoneRegex.test(phoneNumber)) {
            setPhoneNumberError('Please enter a valid 10-digit phone number.');
            return false;
        }
        setPhoneNumberError('');
        return true;
    };










    return (
        <div>
            {!orderConfirmed ? (
                <div className="total-bill-container">
                    
                    <h2 className="total-bill-title" style={{ color: 'black' }}>Food Items</h2>
                    <ul className="total-bill-list">
                        {detectedItems.map((item, index) => (
                            // <li key={index}>
                            //     {item.name} ------ Price ${foodItemPrices[item.name]} ----- Quantity {item.quantity} ----- Total Price: ${(foodItemPrices[item.name] || 0) * item.quantity}
                            // </li>
                            <li key={index} style={{ color: 'black' }}>
                           <span style={{ color: 'rgb(33, 33, 33)' }}> {item.name}</span> - <span style={{ color: 'rgb(99, 99, 99)' }}>
                           <span style={{ color: 'rgb(33, 33, 33)' }}>Price ${foodItemPrices[item.name]} </span> </span> - <span style={{ color: 'rgb(55, 55, 55)' }}> 
                            Quantity {item.quantity}</span> - <span style={{ color: 'rgb(0, 0, 0)' }}> 
                            Total Price ${(foodItemPrices[item.name] || 0) * item.quantity}</span>
                        </li>



                        ))}
                    </ul>
                    <h2 className="total-bill" style={{ color: 'black' }}>Total Bill: ${totalBill}</h2>
                    <input
                        type="tel" // Set type to "tel" for phone number input
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.trim())}
                        placeholder=" Enteryour phone number"
                        maxLength={10} // Limit input to 10 characters
                        required
                        className="input-phone"
                    />

                    {phoneNumberError && <p className="error ">{phoneNumberError}</p>}

                    <button className="confirm-button" onClick={handleConfirmClick}>Confirm Your Order</button>
                </div>
            ) : (
                <Payment totalBill={totalBill} referenceNumber={referenceNumber} detectedItems={detectedItems} phoneNumber={phoneNumber} />
            )}
        </div>
    );
};

export default TotalBill;