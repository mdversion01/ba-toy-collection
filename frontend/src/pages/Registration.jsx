import React, { useState } from 'react';
import axios from 'axios';
import { endpoints } from '../endpoints/Endpoints';

function Registration() {
  const initialFormData = { username: '', password: '', role: 'user' };
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make a POST request to your backend for registration
      const response = await axios.post(endpoints.USERS_REGISTER_URL, formData);

      // Check if registration was successful
      if (response.status === 201) {
        setSuccessMessage('Registration successful');

        // Clear the form fields by resetting the formData state
        setFormData(initialFormData);
      } else {
        setError('Registration failed');
      }
    } catch (error) {
      setError('An error occurred during registration');
    }
  };

  return (
    <div>
      <h2>Registration</h2>
      <form className="registration" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div>Password must be at least 6 characters long. Password must contain at least one letter, one number, and one of these special characters, @$!%*#?&</div>
        <div>
          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit">Register</button>
      </form>
      {successMessage && <p>{successMessage}</p>}
      {error && <p>{error}</p>}
    </div>
  );
}

export default Registration;
