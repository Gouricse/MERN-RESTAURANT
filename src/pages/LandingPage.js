import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import './Menu.css'

const LandingPageWithModals = () => {
  const navigate = useNavigate(); // Initialize navigate hook
  const [registerFormData, setRegisterFormData] = useState({
    customerId: "",
    username: "",
    email: "",
    password: "",
  });

  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
    loginAs: "customer",
  });

  // Success and error messages
  const [registerMessage, setRegisterMessage] = useState("");
  const [loginMessage, setLoginMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    setRegisterMessage(""); // Clear previous messages
    const { customerId, username, email, password } = registerFormData;

    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customerId, username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setRegisterMessage(data.message || "Registration successful!");
      } else {
        setRegisterMessage(data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setRegisterMessage("An error occurred. Please try again.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoginMessage(""); // Clear previous messages
    const { email, password } = loginFormData;

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setLoginMessage(data.message || "Login successful!");
        navigate("/menu"); // Redirect to dashboard on successful login
      } else {
        setLoginMessage(data.message || "Login failed.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginMessage("An error occurred. Please try again.");
    }
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterFormData({
      ...registerFormData,
      [name]: value,
    });
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginFormData({
      ...loginFormData,
      [name]: value,
    });
  };

  return (
    <div className="wrapper">
      <header className="bg-dark text-light py-3">
        <div className="container d-flex justify-content-between align-items-center">
          <h1 className="m-0">Delight Resto</h1>
          <div>
            <button
              className="btn btn-outline-light me-2"
              data-bs-toggle="modal"
              data-bs-target="#registerModal"
            >
              Register
            </button>
            <button
              className="btn btn-outline-light"
              data-bs-toggle="modal"
              data-bs-target="#loginModal"
            >
              Login
            </button>
          </div>
        </div>
      </header>

      <section className="bg-light text-dark text-center py-5">
        <div className="container">
          <h2 className="display-4">Welcome to Delight Resto</h2>
          <p className="lead">
            Experience the finest cuisines crafted with passion and perfection.
          </p>
        </div>
      </section>

      {/* Footer stays at the bottom */}
      <footer className="bg-dark text-light py-4 mt-auto">
        <div className="container text-center">
          <p className="mb-0">&copy; 2024 Delight Resto. All Rights Reserved.</p>
        </div>
      </footer>

      {/* Modal for registration */}
      <div
        className="modal fade"
        id="registerModal"
        tabIndex="-1"
        aria-labelledby="registerModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="registerModalLabel">
                Register
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {registerMessage && (
                <div
                  className={`alert ${registerMessage.includes("error") ? "alert-danger" : "alert-success"
                    }`}
                >
                  {registerMessage}
                </div>
              )}
              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label htmlFor="registerCustomerId" className="form-label">
                    Customer ID
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="registerCustomerId"
                    name="customerId"
                    value={registerFormData.customerId}
                    onChange={handleRegisterChange}
                    placeholder="Enter your Customer ID"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="registerUsername" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="registerUsername"
                    name="username"
                    value={registerFormData.username}
                    onChange={handleRegisterChange}
                    placeholder="Enter your username"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="registerEmail" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="registerEmail"
                    name="email"
                    value={registerFormData.email}
                    onChange={handleRegisterChange}
                    placeholder="Enter your email"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="registerPassword" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="registerPassword"
                    name="password"
                    value={registerFormData.password}
                    onChange={handleRegisterChange}
                    placeholder="Enter your password"
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Register
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for login */}
      <div
        className="modal fade"
        id="loginModal"
        tabIndex="-1"
        aria-labelledby="loginModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="loginModalLabel">
                Login
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {loginMessage && (
                <div
                  className={`alert ${loginMessage.includes("error") ? "alert-danger" : "alert-success"
                    }`}
                >
                  {loginMessage}
                </div>
              )}
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="loginEmail" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="loginEmail"
                    name="email"
                    value={loginFormData.email}
                    onChange={handleLoginChange}
                    placeholder="Enter your email"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="loginPassword" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="loginPassword"
                    name="password"
                    value={loginFormData.password}
                    onChange={handleLoginChange}
                    placeholder="Enter your password"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="loginAs" className="form-label">
                    Login As
                  </label>
                  <select
                    id="loginAs"
                    name="loginAs"
                    className="form-select"
                    value={loginFormData.loginAs}
                    onChange={handleLoginChange}
                  >
                    <option value="customer">Customer</option>
                    <option value="owner">Owner</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPageWithModals;
