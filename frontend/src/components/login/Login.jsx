import React, { useState } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { endpoints } from '../../endpoints/Endpoints';

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(endpoints.LOGIN_URL, formData);
      console.log('Response data:', response.data);
      if (response.status === 200) {
        // Extract user's role from the token payload
        const { token } = response.data;
        const { role } = jwt_decode(token);
  
        // Store the token and user's role in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('userRole', role);
  
        // Redirect to the desired page or update state to indicate successful login
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      setError('An error occurred during login');
    }
  };
  
  return (
    <div>
      <form className="login" onSubmit={handleSubmit}>
        <div className="me-2">
          <label className="sr-only" htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="form-control form-control-sm me-5"
            placeholder="Username"
          />
        </div>
        <div className="me-2">
          <label className="sr-only" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-control form-control-sm"
            placeholder="Password"
          />
        </div>
        <button className="btn btn-sm btn-light" type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}

export default Login;
