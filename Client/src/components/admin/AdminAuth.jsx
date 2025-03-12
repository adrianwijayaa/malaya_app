import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminAuth.css";

const AdminAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!isLogin && credentials.password !== credentials.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const endpoint = isLogin ? "/login" : "/register";
      const response = await fetch(
        `https://demalayaapp-production.up.railway.app/api/v1${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: credentials.username,
            password: credentials.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      if (isLogin) {
        // Store the JWT token received from the backend
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminAuth", "true");
        navigate("/admin");
      } else {
        setIsLogin(true);
        setCredentials({
          username: "",
          password: "",
          confirmPassword: "",
          email: "",
        });
        setError("Registration successful! Please login.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-auth-wrapper">
      <div className="admin-auth-container">
        <div className="admin-auth-box">
          <div className="auth-header">
            <h1>{isLogin ? "Admin Login" : "Admin Registration"}</h1>
            <div className="auth-tabs">
              <button
                className={`tab-btn ${isLogin ? "active" : ""}`}
                onClick={() => setIsLogin(true)}
              >
                Login
              </button>
              <button
                className={`tab-btn ${!isLogin ? "active" : ""}`}
                onClick={() => setIsLogin(false)}
              >
                Register
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="username">
                <i className="fas fa-user"></i>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={credentials.username}
                onChange={handleInputChange}
                placeholder="Username"
                required
                autoComplete="username"
              />
            </div>

            {!isLogin && (
              <div className="form-group">
                <label htmlFor="email">
                  <i className="fas fa-envelope"></i>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="password">
                <i className="fas fa-lock"></i>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                placeholder="Password"
                required
                autoComplete="current-password"
              />
            </div>

            {!isLogin && (
              <div className="form-group">
                <label htmlFor="confirmPassword">
                  <i className="fas fa-lock"></i>
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={credentials.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm Password"
                  required
                />
              </div>
            )}

            {error && <div className="auth-error">{error}</div>}

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading-spinner">
                  <i className="fas fa-spinner fa-spin"></i>
                  {isLogin ? " Logging in..." : " Registering..."}
                </span>
              ) : (
                <span>
                  <i
                    className={`fas fa-${
                      isLogin ? "sign-in-alt" : "user-plus"
                    }`}
                  ></i>
                  {isLogin ? " Login" : " Register"}
                </span>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                className="switch-btn"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                  setCredentials({
                    username: "",
                    password: "",
                    confirmPassword: "",
                    email: "",
                  });
                }}
              >
                {isLogin ? "Register here" : "Login here"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;
