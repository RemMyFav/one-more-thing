import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/login.css";
import axios from "../api/axios";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
/* global google */
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function Login() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");

  const errRef = useRef(null);

  const navigate = useNavigate();

  //-------------------------------register username does not exist alert------------------------------------
  const [openRegisterExistAlert, setOpenRegisterExistAlert] = React.useState(
    false
  );

  const handleRegisterExistClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenRegisterExistAlert(false);
  };

  //-------------------------------register oauth alert------------------------------------
  const [openRegisterOauthAlert, setOpenRegisterOauthAlert] = React.useState(
    false
  );

  const handleRegisterOauthClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenRegisterOauthAlert(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = axios
        .post(
          "/user/login",
          { username, password },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        )
        .then((res) => {
          //cookie
          navigate("/");
        })
        .catch((err) => {
          if (err.response.status === 404) {
            // navigate("/login");
            setOpenRegisterExistAlert(true);
          }
          if (err.response.status === 400) {
            // navigate("/login");
            setOpenRegisterOauthAlert(true);
          }

          console.log(err);
        });

      setError("");
      setUsername("");
      setPassword("");
    } catch (error) {
      setOpenRegisterExistAlert(true);

      console.log(error);
    }
  };
  const responseGoogle = async (response) => {
    try {
      await axios
        .post("/user/oAuth", {
          jwt: response.credential,
        })
        .then((res) => {
          const token = res.data.token;
          const username = res.data.name;
          const personalCalendar = axios
            .get("/personalCalendar", {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
              if (res.data.length === 0) {
                axios.post(
                  "/personalCalendar",
                  {
                    title: username + "'s Calendar",
                  },
                  {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                  }
                );
              }
              navigate("/");
            })
            .catch((err) => {
              setOpenRegisterOauthAlert(true);
              console.log(err);
            });
        });
    } catch (error) {
      setOpenRegisterOauthAlert(true);
      console.log(error);
    }
  };

  useEffect(() => {
    google.accounts.id.initialize({
      client_id:
        "448858412144-s2q69l97gpmb7u5krdh39tipjugvmlqh.apps.googleusercontent.com",
      callback: responseGoogle,
    });

    google.accounts.id.renderButton(document.getElementById("google-login"), {
      theme: "outline",
      size: "large",
    });
  }, []);

  return (
    <>
      {/* <div>
        <p ref={errRef}>{error}</p>
      </div>
      <h1> Login </h1>
      <form onSubmit={handleSubmit} className="Registration">
        <label> Username: </label>
        <input
          type="text"
          id="username"
          autoComplete="off"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          required
        />
        <label> Password: </label>
        <input
          type="password"
          id="password"
          autoComplete="off"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
        />
        <button type="submit">Login</button>
        Need an account? <Link to={"/register"}>Sign Up</Link>
        <div id="google-login"></div>
      </form> */}
      <div>
        <p ref={errRef}>{error}</p>
      </div>
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

                <span className="focus-input100" placeholder="Username"></span>
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
                  autoComplete="off"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  required
                />
                <span className="focus-input100" placeholder="Password"></span>
              </div>

              <div className="container-login100-form-btn">
                <div className="wrap-login100-form-btn">
                  <div className="login100-form-bgbtn"></div>
                  <button type="submit" className="login100-form-btn">
                    Login
                  </button>
                </div>
              </div>
              {/* <div id="google-login"></div> */}
              <div className="google-btn" id="google-login">
                <div className="google-icon-wrapper">
                  <img
                    className="google-icon-svg"
                    src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                  />
                </div>
                <p className="btn-text">
                  <b>Sign in with Google</b>
                </p>
              </div>
              <div className="text-center p-t-115">
                <span className="txt1">Don’t have an account?</span>

                <a className="txt2" href="/register">
                  Sign Up
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
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
            Login failed. Please check your username and password.
          </Alert>
        </Snackbar>
      </Stack>
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar
          open={openRegisterOauthAlert}
          autoHideDuration={6000}
          onClose={handleRegisterOauthClose}
        >
          <Alert
            onClose={handleRegisterOauthClose}
            severity="warning"
            sx={{ width: "100%" }}
          >
            Please use the Google Login button to login.
          </Alert>
        </Snackbar>
      </Stack>
    </>
  );
}

export default Login;
