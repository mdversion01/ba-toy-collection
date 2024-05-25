import React, { useState } from "react";
import axios from "axios";
import { endpoints } from "../endpoints/Endpoints";

function Registration() {
  const initialFormData = { username: "", password: "", role: "user" };
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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
        setSuccessMessage("Registration successful");

        // Clear the form fields by resetting the formData state
        setFormData(initialFormData);
      } else {
        setError("Registration failed");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      setError("An error occurred during registration");
    }
  };

  return (
    <div class="registration-wrapper">
      <fieldset>
        <legend>Registration</legend>
        <form className="registration" onSubmit={handleSubmit}>
          <div class="form-group">
            <label htmlFor="usernameInput">Username</label>
            <input
              type="text"
              id="usernameInput" // Unique ID for username input
              name="username"
              value={formData.username}
              onChange={handleChange}
              class="form-control form-control-sm"
            />
          </div>
          <div class="form-group">
            <label htmlFor="passwordInput">Password</label>
            <input
              type="password"
              id="passwordInput" // Unique ID for password input
              name="password"
              value={formData.password}
              onChange={handleChange}
              class="form-control form-control-sm"
            />
            <div class="help-block">
              Password must be at least 6 characters long. Password must contain
              at least one letter, one number, and one of these special
              characters, @$!%*#?&
            </div>
          </div>

          <div class="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="roleSelect" // Unique ID for role select
              name="role"
              value={formData.role}
              onChange={handleChange}
              class="form-control form-control-sm"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary btn-sm">
            Register
          </button>
        </form>
        {successMessage && <p>{successMessage}</p>}
        {error && <p>{error}</p>}
      </fieldset>
    </div>
  );
}

export default Registration;
