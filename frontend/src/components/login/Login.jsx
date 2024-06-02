import React, { useState } from 'react';
import usersData from '../../json/users.json';
import bcrypt from 'bcryptjs'; // Import bcryptjs for hashing passwords

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const sanitizeInput = (input) => {
    const element = document.createElement('div');
    element.innerText = input;
    return element.innerHTML;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: sanitizeInput(value) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const user = usersData.find(
        (user) =>
          user.username === formData.username &&
          bcrypt.compareSync(formData.password, user.password)
      );

      if (user) {
        const token = "mockToken"; // Mock token since we're not using a real backend
        const role = user.role;

        // Store the token and user's role in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('userRole', role);

        // Redirect to the desired page or update state to indicate successful login
        // For example, you can use history.push('/dashboard') if you're using react-router
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
