import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserCard from "./components/UserCard/userCard";
import Dashboard from "./components/Dashboard/dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserCard />} />
        <Route path="/dashboard/:userId" element={<Dashboard />} />{" "}
       
      </Routes>
    </Router>
  );
}

export default App;
