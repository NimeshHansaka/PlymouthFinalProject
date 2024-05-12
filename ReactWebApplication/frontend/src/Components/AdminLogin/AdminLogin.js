
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate and Link
import './AdminLogin.css';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        // Check admin credentials (You can replace this with your authentication logic)
        if (username === 'admin' && password === 'password') {
            // If credentials are correct, navigate to admin dashboard
            navigate('/about');
        } else {
            alert('Invalid username or password');
        }
    };

    const handleCancel = () => {
        // Redirect to home page when cancel button is clicked
        navigate('/');
    };

    return (
        <div className="admin-login-container"> {/* Apply class for container */}
            <h1>Admin Login</h1>
            <input 
                type="text" 
                placeholder="Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
            />
            <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
            />
            <button onClick={handleLogin}>Login</button>
            {/* Cancel button */}
            <Link to="/">
                <button className="cancel-button" onClick={handleCancel}>Cancel</button>
            </Link>
        </div>
    );
};

export default AdminLogin;