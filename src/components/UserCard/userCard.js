import React, { useState, useEffect } from "react";
import "./userCard.css";
// import Header from "../Header/header";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 


const UserCard = () => {
  const navigate = useNavigate();

  const handleNavigation = (userId) => {
    navigate(`/dashboard/${userId}`);
  };

  // State to store fetched users and their form data
  const [users, setUsers] = useState([]);
  const [userFormState, setUserFormState] = useState([]);

  // Fetch users from API when component mounts
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/users") // Fetching all users
      .then((response) => {
        const usersData = response.data;
        setUsers(usersData);
        // Initialize the form state for each user
        setUserFormState(
          usersData.map(() => ({
            milkQty: "0L",
            // dailyStatus: "yes",
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  // Handle input change in the form fields ande send back the data to the server
  const handleInputChange = (idx, field, value) => {
    const updatedFormState = userFormState.map((user, index) => {
      if (index === idx) {
        return {
          ...user,
          [field]: value,
        };
      }
      return user;
    });
    setUserFormState(updatedFormState);
  };

  // Submit the updated milk supply data to the server
  const handleSubmit = (e, idx) => {
    e.preventDefault();

    const userId = users[idx]._id;
    const updatedData = {
      userId: userId,
      quantity: parseFloat(userFormState[idx].milkQty),
      status: userFormState[idx].dailyStatus,
    };

    axios
      .post("http://localhost:8000/api/milk-supply", updatedData)
      .then((response) => {
        // console.log("Milk supply data submitted:", response.data);
      })
      .catch((error) => {
        console.error("Error submitting milk supply data:", error);
      });
  };

  return (
    <>
      <div className="user-main-container">
        {users.map((userData, idx) => (
          <div className="user-container" key={idx}>
            <button
              className="user-button"
              onClick={() => handleNavigation(userData._id)}
            >
              Dashboard
            </button>
            <div className="user-card">
              <div className="user-info">
                <div className="user-avatar">{userData.name[0]}</div>
                <h1>{userData.name}</h1>
              </div>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Phone</span>
                  <span className="info-value">{userData.phone}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Address</span>
                  <span className="info-value">
                    {userData.address.length > 60
                      ? userData.address.substring(0, 60) + "..."
                      : userData.address}
                  </span>
                </div>
              </div>
              <form
                onSubmit={(e) => handleSubmit(e, idx)}
                className="user-form"
              >
                <div className="form-group">
                  <label htmlFor={`milkQty-${idx}`}>Milk Qty (in liters)</label>
                  <select
                    id={`milkQty-${idx}`}
                    value={userFormState[idx].milkQty}
                    onChange={(e) =>
                      handleInputChange(idx, "milkQty", e.target.value)
                    }
                  >
                    <option>0</option>
                    <option>0.5</option>
                    <option>1</option>
                    <option>1.5</option>
                    <option>2</option>
                    <option>2.5</option>
                    <option>3</option>
                    <option>3.5</option>
                    <option>4</option>
                  </select>
                </div>
                {/* 
                <div className="form-group">
                  <label htmlFor={`dailyStatus-${idx}`}>Daily Status</label>
                  <select
                    id={`dailyStatus-${idx}`}
                    value={userFormState[idx].dailyStatus}
                    onChange={(e) =>
                      handleInputChange(idx, "dailyStatus", e.target.value)
                    }
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                */}
                <button type="submit" className="save-button">
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default UserCard;
