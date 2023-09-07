import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/home.css";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import axios from "../api/axios";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Register() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [confimpwd, setConfimpwd] = useState("");
  const [email, setEmail] = useState("");
  // const [success, setSuccess] = useState("");

  //-------------------------------register success alert------------------------------------
  const [
    openRegisterSuccessAlert,
    setOpenRegisterSuccessAlert,
  ] = React.useState(false);
  const [openErrorAlert, setOpenErrorAlert] = React.useState(false);

  const handleRegisterSuccessClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenRegisterSuccessAlert(false);
  };

  //-------------------------------register username exist alert------------------------------------
  const [openRegisterExistAlert, setOpenRegisterExistAlert] = React.useState(
    false
  );

  const handleRegisterExistClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenRegisterExistAlert(false);
  };
  //-------------------------------register password dont match alert------------------------------------
  const [openRegisterMatchAlert, setOpenRegisterMatchAlert] = React.useState(
    false
  );

  const handleRegisterMatchClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenRegisterMatchAlert(false);
  };
  //--------------------------------------------------------------------------------

  const errRef = useRef(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confimpwd) {
      setOpenRegisterMatchAlert(true);
      errRef.current.style.display = "block";
      return;
    }
    try {
      const response = await axios.post(
        "/user",
        {
          username,
          password,
          email,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      // const token = response.data.token;
      // assign default calendar to user
      const calendar = await axios.post(
        "/personalCalendar",
        {
          title: username + "'s Calendar",
        },
        {
          withCredentials: true,
        }
      );
      setError("");
      setUsername("");
      setEmail("");
      setPassword("");
      setConfimpwd("");
      navigate("/");
    } catch (err) {
      setOpenRegisterExistAlert(true);
      console.log(err);
    }
  };

  return (
    <>
      <div>
        <p ref={errRef}>{error}</p>
      </div>
      {/* <form onSubmit={handleSubmit} className="Registration">
        <label htmlFor="username"> Username: </label>
        <input
          type="text"
          id="username"
          autoComplete="off"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          required
        />
        <label htmlFor="email"> Email: </label>
        <input
          type="email"
          id="email"
          autoComplete="off"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
        />
        <label htmlFor="password "> Password: </label>
        <input
          type="password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
        />
        <label htmlFor="confirmpwd "> Confirm Password: </label>
        <input
          type="password"
          id="confirmpwd"
          onChange={(e) => setConfimpwd(e.target.value)}
          value={confimpwd}
          required
        />
        <button type="submit">Login</button>
        Have an account? <Link to={"/login"}>Login</Link>
      </form> */}
      <div className="limiter">
        <div className="container-login100">
          <div className="wrap-login100">
            <form
              onSubmit={handleSubmit}
              className="login100-form validate-form"
            >
              <span className="login100-form-title p-b-26">Welcome</span>
              <span className="login100-form-title p-b-48">
                <i className="zmdi zmdi-font"></i>
              </span>
              <div className="wrap-input100 validate-input">
                <input
                  className="input100"
                  type="text"
                  name="Username"
                  placeholder="Username"
                  id="username"
                  autoComplete="off"
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  required
                />

                <span
                  className="focus-input100"
                  placeholder="Enter username"
                ></span>
              </div>

              <div className="wrap-input100 validate-input">
                <input
                  className="input100"
                  name="email"
                  placeholder="Email Address"
                  type="email"
                  id="email"
                  autoComplete="off"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                />

                <span
                  className="focus-input100"
                  placeholder="Enter email"
                ></span>
              </div>

              <div
                className="wrap-input100 validate-input"
                data-validate="Enter password"
              >
                <span className="btn-show-pass">
                  <i className="zmdi zmdi-eye"></i>
                </span>
                <input
                  className="input100"
                  type="password"
                  name="pass"
                  placeholder="Password"
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  required
                />
                <span className="focus-input100" placeholder="Password"></span>
              </div>

              <div
                className="wrap-input100 validate-input"
                data-validate="Confirm password"
              >
                <span className="btn-show-pass">
                  <i className="zmdi zmdi-eye"></i>
                </span>
                <input
                  className="input100"
                  type="password"
                  name="pass"
                  placeholder="Confirm Password"
                  id="confirmpwd"
                  onChange={(e) => setConfimpwd(e.target.value)}
                  value={confimpwd}
                  required
                />
                <span
                  className="focus-input100"
                  placeholder="Confirm Password"
                ></span>
              </div>

              <div className="container-login100-form-btn">
                <div className="wrap-login100-form-btn">
                  <div className="login100-form-bgbtn"></div>
                  <button type="submit" className="login100-form-btn">
                    Register
                  </button>
                </div>
              </div>

              <div className="text-center p-t-115">
                <span className="txt1">Have an account?</span>

                <a className="txt2" href="/login">
                  Login
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar
          open={openRegisterSuccessAlert}
          autoHideDuration={6000}
          onClose={handleRegisterSuccessClose}
        >
          <Alert
            onClose={handleRegisterSuccessClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            You have successfully created a account!
          </Alert>
        </Snackbar>
      </Stack>
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar
          open={openRegisterExistAlert}
          autoHideDuration={6000}
          onClose={handleRegisterExistClose}
        >
          <Alert
            onClose={handleRegisterExistClose}
            severity="warning"
            sx={{ width: "100%" }}
          >
            The username is already exist!
          </Alert>
        </Snackbar>
      </Stack>
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar
          open={openRegisterMatchAlert}
          autoHideDuration={6000}
          onClose={handleRegisterMatchClose}
        >
          <Alert
            onClose={handleRegisterMatchClose}
            severity="warning"
            sx={{ width: "100%" }}
          >
            Password don't match!
          </Alert>
        </Snackbar>
      </Stack>
    </>
  );
}
