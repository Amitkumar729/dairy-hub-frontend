import React, { useState, useEffect } from "react";
import "./dashboard.css";
import { useParams } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [monthlyReport, setMonthlyReport] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("2024-10");
  const [paymentStatus, setPaymentStatus] = useState("Pending");

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/users/${userId}`)
      .then((response) => {
        setUserData(response.data);
        // console.log("userData: ", userData);
      })
      .catch((error) => {
        console.log("Error Fetching the user data: ", error);
      });

    if (selectedMonth) {
      axios
        .post(`http://localhost:8000/api/monthly-report/${userId}`, {
          month: selectedMonth,
        })
        .then((response) => {
          // console.log("response: ", response);
          setMonthlyReport(response.data);
        })
        .catch((error) => {
          console.error("Error fetching monthly report:", error);
        });
    }
  }, [selectedMonth, userId]);

  return (
    <div className="dashboard-main-container">
    <div className="dashboard-container">
      {userData && (
        <div className="dashboard-card">
          <div className="avatar">{userData.name[0]}</div>
          <h1>{userData.name}</h1>
          <div className="user-info">
            <p>
              <strong>Phone:</strong> {userData.phone}
            </p>
            <p>
              <strong>Address:</strong> {userData.address}
            </p>
          </div>
          <h2>Monthly Supply Status</h2>
          {monthlyReport && (
            <>
              <div className="month-container">
                <h4>Select Month: </h4>
                <select
                  id="month-select"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  <option value="2024-08">August 2024</option>
                  <option value="2024-09">September 2024</option>
                  <option value="2024-10">October 2024</option>
                  <option value="2024-11">November 2024</option>
                  <option value="2024-12">December 2024</option>
                  {/* Add more months as needed */}
                </select>
              </div>
              <div className="supply-info">
                <p>
                  <strong>Total Milk Qty:</strong> {monthlyReport.totalQuantity}{" "}
                  L
                </p>
                <p>
                  <strong>Total Milk Price:</strong> ₹{monthlyReport.totalPrice}
                </p>
              </div>
              <div className="payment-status">
                <label htmlFor="payment">Payment:</label>
                <select
                  id="payment"
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
              <table className="supply-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyReport.dailyEntries.map((entry) => (
                    <tr key={entry._id}>
                      <td>{new Date(entry.date).toLocaleDateString()}</td>
                      <td>{entry.quantity}L</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}
    </div>
    </div>
  );
};

export default Dashboard;
