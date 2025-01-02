import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      // If no token is found, redirect to the login page
      navigate("/");
    }
  }, [navigate]);

  return (
    <div>
      <h2>Welcome to your Dashboard</h2>
      <p>You are logged in!</p>
    </div>
  );
}

export default Dashboard;
