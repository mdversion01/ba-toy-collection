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

  const validatePassword = (password) => {
    const minLength = 6;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const specialCharRegex = /[@$!%*#?&]/;
    const hasSpecialChar = specialCharRegex.test(password);

    if (password.length < minLength) {
      return `Password must be at least ${minLength} characters long.`;
    }
    if (!hasLetter) {
      return "Password must contain at least one letter.";
    }
    if (!hasNumber) {
      return "Password must contain at least one number.";
    }
    if (!hasSpecialChar) {
      return "Password must contain at least one of these special characters: @$!%*#?&.";
    }
    const invalidSpecialChars = password.split('').filter(char => /[^a-zA-Z0-9@$!%*#?&]/.test(char));
    if (invalidSpecialChars.length > 0) {
      return `Password contains invalid special characters: ${invalidSpecialChars.join(', ')}`;
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    try {
      console.log("Form Data:", formData);

      // Make a POST request to your backend for registration
      const response = await axios.post(endpoints.USERS_REGISTER_URL, formData);

      // Check if registration was successful
      if (response.status === 201) {
        setSuccessMessage("Registration successful");

        // Clear the form fields by resetting the formData state
        setFormData(initialFormData);
        setError(""); // Clear any previous error messages
      } else {
        setError("Registration failed");
      }
    } catch (error) {
      console.error("Registration Error:", error.response?.data); // Log detailed error response
      setError(error.response?.data?.message || "An error occurred during registration");
    }
  };

  return (
    <div className="registration-wrapper">
      <fieldset>
        <legend>Registration</legend>
        <form className="registration" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="usernameInput">Username</label>
            <input
              type="text"
              id="usernameInput" // Unique ID for username input
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-control form-control-sm"
            />
          </div>
          <div className="form-group">
            <label htmlFor="passwordInput">Password</label>
            <input
              type="password"
              id="passwordInput" // Unique ID for password input
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control form-control-sm"
            />
            <div className="help-block">
              Password must be at least 6 characters long. Password must contain
              at least one letter, one number, and one of these special
              characters, @$!%*#?&
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="roleSelect" // Unique ID for role select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-control form-control-sm"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary btn-sm">
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
