import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faTimes } from '@fortawesome/free-solid-svg-icons'; // Added faTimes for close icon
import TotalBill from '../TotalBill/TotalBill';
import { Link } from 'react-router-dom'; // Import Link from React Router
import axios from 'axios'; // Import axios for making HTTP requests
import './CaptureImage.css'; // Import CSS file for styling

// Import sound files
import pendingSound from './error.mp3'; // Assuming you have defined pending sound file

const CaptureImage = () => {
  const [detectedItems, setDetectedItems] = useState([]);
  const [capturedItems, setCapturedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showObjectDetection, setShowObjectDetection] = useState(false);
  const [noItemsDetected, setNoItemsDetected] = useState(false);
  const [pendingPayment, setPendingPayment] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');





  useEffect(() => {
    const checkPendingPayments = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/orders/pending');
        const pendingOrders = response.data.pendingOrders;
        setPendingPayment(pendingOrders.length > 0);
        setLoading(false); // Set loading to false after checking pending payments
      } catch (error) {
        console.error('Error checking pending payments:', error);
        setLoading(false); // Set loading to false in case of error
        setErrorMessage('Error checking pending payments. Please try again later.'); // Set error message
      }
    };
  
    checkPendingPayments(); // Check pending payments when component mounts
  
    // Set interval to check for pending payments periodically
    const interval = setInterval(() => {
      checkPendingPayments();
    }, 30000); // Check every 30 seconds
  
    return () => {
      clearInterval(interval); // Clear interval when component unmounts
    };
  }, []);

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:5000/video_feed');

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setDetectedItems(data.detected_items);
      setNoItemsDetected(data.detected_items.length === 0); // Set noItemsDetected state based on whether detectedItems is empty or not
    };

    // Check for pending payments when component mounts
    //checkPendingPayments();

    // Set interval to check for pending payments periodically
    //const interval = setInterval(() => {
      //checkPendingPayments();
    //}, 30000); // Check every 10 seconds

    return () => {
      eventSource.close();
     // clearInterval(interval); // Clear interval when component unmounts
    };
  }, []);




  useEffect(() => {
    // Play pending sound when pendingPayment state changes and user has interacted
    if (pendingPayment && hasInteracted) {
      playPendingSound();
    }
  }, [pendingPayment, hasInteracted]);





  // useEffect(() => {
  //   // Check for pending payments when the component mounts
  //   checkPendingPayments();
  // }, []); // Empty dependency array ensures the effect runs only once on component mount





  const capture = async () => {
    setLoading(true);
    try {
      // Capture image only if there are detected items
      if (detectedItems.length > 0) {



        

        setCapturedItems(detectedItems); // Store detected items
        setLoading(false); // Simulate image capture completion
        setShowObjectDetection(true); // Show the second screen after capturing image
       // const capturedImageUrl = 'http://10.10.92.138:5000/captured_image'; // Set the captured image URL
        // Pass both captured image URL and detected items to ObjectDetection component
        setCapturedItems(detectedItems);
      } else {
        setNoItemsDetected(true); // Set noItemsDetected to true if no items are detected
        setLoading(false);
      }
    } catch (error) {
      console.error('Error capturing image:', error);
      setLoading(false); // Ensure loading state is reset in case of error
    }
  };

  const playPendingSound = () => {
    const pendingAudio = new Audio(pendingSound);
    pendingAudio.loop = true; // Set loop property to true
    pendingAudio.play();
  };


  const handleInteraction = () => {
    // Set hasInteracted to true when user interacts with the component
    setHasInteracted(true);
  };













  // const checkPendingPayments = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:4000/api/orders/pending');
  //     const pendingOrders = response.data.pendingOrders;
  //     // Update state to indicate pending payment
  //     setPendingPayment(pendingOrders.length > 0);
  //   } catch (error) {
  //     console.error('Error checking pending payments:', error);
  //   }
  // };







  
















  return (
    <div className="capture-image-container" onClick={handleInteraction}>
      
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {errorMessage && (
            <div className="error-message">
              <FontAwesomeIcon icon={faExclamationCircle} className="error-icon" />
              {errorMessage}
            </div>
          )}
      
      
      
      {showObjectDetection ? (
        <TotalBill detectedItems={capturedItems}/>
      ) : (
        <div className={`capture-form ${noItemsDetected ? 'no-items-detected' : ''}`}>
          <div className="header">
          <h1 className="welcome-message" style={{ color: 'black' }}>Welcome!</h1>
          </div>
          
          <div>
          <h3 className="instruction" style={{ color: 'black' }}>Put Your Tray Here</h3>
          
           {/* {noItemsDetected && (
            <div className="no-items-detected-message">
              <FontAwesomeIcon icon={faExclamationCircle} className="error-icon" />
              No items detected. Please ensure there are items in the tray.
            </div>
            )}  */}
          
           {/* Display pending payment notification */}
           {pendingPayment && hasInteracted && (
            <div className="pending-payment-message">
              <FontAwesomeIcon icon={faExclamationCircle} className="error-icon" />
              There are pending payments. Please check them before proceeding.
            </div>
          )}
          
          
          </div>
        
          
          
          
          
          <div className="webcam-container">
            {/* Webcam or image display */}
            <img src="http://localhost:5000/video" alt="Camera Feed" />
          </div>
          {/* Display detected items */}
          <h2 style={{ color: 'black' }}>Detected Food Items</h2>
          <ul className='detected-items-list'>
            {detectedItems.map((item, index) => (
              <li key={index}>
                {item.name} - Quantity: {item.quantity}
              </li>
            ))}
          </ul>
          {loading ? (
            <p className="loading-text">Capturing image...</p>
          ) : (
            <button className="capture-button" onClick={capture} >
              Capture Image
            </button>
          )}
         
          
          {/* Close button */}
          <Link to="/"> {/* Navigate to home page */}
            <button className="close-button">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </Link>
        </div>
      )}
       </>
      )}
    </div>



  );
};

export default CaptureImage;






