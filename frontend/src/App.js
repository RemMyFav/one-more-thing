/* eslint-disable */
import React from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";

import Calendar_create from "./pages/create_calendar";
import Calendar_update from "./pages/update_calendar";
import Change_password from "./pages/changepassword";
import Missing from "./pages/missing";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route exact path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/Calendar_create" element={<Calendar_create />} />
        <Route path="/Calendar_update" element={<Calendar_update />} />
        <Route path="/Change_password" element={<Change_password />} />

        {/* Missing routes */}
        <Route path="*" element={<Missing />} />
      </Routes>
    </Router>
  );
}

export default App;
