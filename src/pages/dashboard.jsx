import React, { useState } from "react";
import axios from "axios";
import AdminNavbar from "../Component/Layout/CustomNavbar";

const Dashboard = () => {
  return (
    <div>
      <AdminNavbar />
      <div className="container mt-5">

        <h1>Welcome to the Dashboard</h1>
        <p>This is your secure dashboard page.</p>
      </div>
    </div>
  );
};

export default Dashboard;
