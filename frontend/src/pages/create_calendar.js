/* eslint-disable */
import { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import InfoIcon from "@mui/icons-material/Info";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import "react-calendar/dist/Calendar.css";
import "../style/create_calendar.css";
import { Link, useNavigate } from "react-router-dom";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
const drawerWidth = 240;
import TextField from "@mui/material/TextField";
import purple from "@material-ui/core/colors/purple";
import { SnackbarProvider } from "notistack";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import axios from "../api/axios";

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Calendar_create() {
  const [openSuccessAlert, setOpenSuccessAlert] = React.useState(false);
  const [openErrorAlert, setOpenErrorAlert] = React.useState(false);
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [personalCalendar, setPersonalCalendars] = useState([]);
  const [groupCalendar, setGroupCalendars] = useState([]);

  //----------------------user info dialog-----------------------------------

  //------------------------------------user info dialog-----------------------------
  const [openUserInfo, setOpenUserInfo] = useState(false);
  function dynamicinfodialog() {
    try {
      axios
        .get("/user/get", {
          withCreditentials: true,
        })
        .then((response) => {
          localStorage.setItem("curuser", response.data.username);
          localStorage.setItem("curemail", response.data.email);
          // const curcal = currCalendarRef.current.title;
          // setOpenUserInfo(true);
        });
    } catch (error) {
      console.log(error);
    }
    const user = localStorage.getItem("curuser");
    const email = localStorage.getItem("curemail");
    const curcal = JSON.parse(localStorage.getItem("currCalendar"));
    //get the current calendar title

    return (
      <div>
        username: {user}
        <br />
        email: {email}
        <br />
        calendar: {curcal.title}
      </div>
    );
  }
  const handleUserInfoOpen = () => {
    setOpenUserInfo(true);
  };

  const handleUserInfoClose = () => {
    setOpenUserInfo(false);
  };

  //----------------------------------------------------

  const navigate = useNavigate();
  //getting all calendars
  useEffect(() => {
    axios
      .get("/personalCalendar", {
        withCreditentials: true,
      })
      .then((response) => {
        setPersonalCalendars(response.data);
      })
      .catch((error) => {
        if (error.response.status === 401) {
        }
      });
  }, []);
  useEffect(() => {
    axios
      .get("/groupCalendar", {
        withCreditentials: true,
      })
      .then((response) => {
        setGroupCalendars(response.data);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          navigate("/login");
        }
      });
  }, []);

  const checkboxRef = useRef(null);
  const [checked, SetChecked] = useState(false);

  const handleLogout = () => {
    axios.post("/user/logOut", { withCreditentials: true });
    navigate("/login");
  };

  // keep track of checkbox
  const checkBoxOnChange = (event) => {
    SetChecked(event.target.checked);
  };

  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState("");

  const submitCalendar = (event) => {
    //if checkbox checked then create group calendar, else create personal calendar
    event.preventDefault();
    if (checked) {
      axios
        .post(
          "/groupCalendar",

          {
            title: inputValue,
            owner: "group",
            createDate: new Date(),
            participant: [],
          },
          {
            withCreditentials: true,
          }
        )
        .then(() => {
          axios
            .get("/groupCalendar", {
              withCreditentials: true,
            })
            .then((response) => {
              setGroupCalendars(response.data);
            })
            .catch((error) => {
              if (error.response.status === 401) {
                navigate("/login");
              }
            });
        })
        .catch((error) => {
          if (error.response.status === 401) {
            navigate("/login");
          }
          setOpenErrorAlert(true);
        });
      setOpenSuccessAlert(true);
      document.getElementById("create_calendar_name").reset();
    } else {
      axios
        .post(
          "/personalCalendar",
          {
            title: inputValue,
            owner: "personal",
            createDate: new Date(),
            participant: [],
          },
          {
            withCreditentials: true,
          }
        )
        .then(() => {
          axios
            .get("/personalCalendar", {
              withCreditentials: true,
            })
            .then((response) => {
              setPersonalCalendars(response.data);
            })
            .catch((error) => {
              if (error.response.status === 401) {
                navigate("/login");
              }
            });
        })
        .catch((error) => {
          setOpenErrorAlert(true);
          if (error.response.status === 401) {
            navigate("/login");
          }
        });
      setOpenSuccessAlert(true);
      document.getElementById("create_calendar_name").reset();
    }
  };
  //-------------------------------alert------------------------------------
  const handleClick = () => {
    setOpenSuccessAlert(true);
  };
  const handleSuccessClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSuccessAlert(false);
  };

  const handleErrorClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenErrorAlert(false);
  };
  //-------------------------------appbar ------------------------------------------------------------
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleInfo = () => {
    // pop up window showing calendar info
    window.alert("This is a test");
  };

  //-------------------------------appbar ------------------------------------------------------------
  //-------------------------------darwer-------------------------------------------------------------

  //once submit, create calendar ++++++++++++++++++++++++++++++++++++++

  const handleDrawerOpen = () => {
    document.getElementById("profileIcon").hidden = true;
    document.getElementById("infoIcon").hidden = true;
    setOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerClose = () => {
    document.getElementById("profileIcon").hidden = false;
    document.getElementById("infoIcon").hidden = false;
    setOpen(false);
  };
  const ariaLabel = { "aria-label": "description" };

  //-------------------------------darwer-------------------------------------------------------------
  return (
    <Box>
      <CssBaseline />

      <AppBar position="static" open={open} style={{ background: "#FFFFFF" }}>
        <Toolbar>
          <Typography
            sx={{ flexGrow: 1 }}
            className="title"
            variant="h5"
            fontFamily={"-apple-system"}
            fontWeight={"200"}
            noWrap
            component={Link}
            to="/"
            style={{ color: purple[500] }}
          >
            Calendar
          </Typography>
          <div className="appbar-right"></div>
          <div id="infoIcon">
            <IconButton
              size="large"
              aria-label="current calendar"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleUserInfoOpen}
              color="inherit"
              style={{ color: purple[300] }}
              sx={{ flexGrow: 1 }}
            >
              <InfoIcon />
            </IconButton>
          </div>

          <div id="profileIcon">
            <Box sx={{ flexGrow: 0 }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
                style={{ color: purple[300] }}
              >
                <AccountCircle />
              </IconButton>

              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem component={Link} to="/Change_password">
                  Change Password
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
          </div>
        </Toolbar>
      </AppBar>

      <div className="row">
        <div
          className="create_loc"
          style={{
            position: "absolute",
            left: "47%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Box sx={{ p: 5, top: "100px" }} className="create_calendar">
            <h1 style={{ color: "rgb(156, 39, 176)" }}>Create a Calendar</h1>{" "}
            <form id="create_calendar_name" onSubmit={submitCalendar}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  "& > :not(style)": { m: 2 },
                }}
              >
                <TextField
                  helperText="Please enter your Calendar's name"
                  color="secondary"
                  label="Name"
                  ref={inputRef}
                  onChange={(event) => setInputValue(event.target.value)}
                />
              </Box>

              <br />
              <Box
                style={{
                  position: "absolute",
                  left: "47%",
                  bottom: "20%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox ref={checkboxRef} onChange={checkBoxOnChange} />
                    }
                    label="Group Calendar"
                    style={{ color: "rgb(74 0 164)" }}
                  />
                </FormGroup>
              </Box>
            </form>
            <br />
            <br />
            <Box
              style={{
                position: "absolute",
                left: "47%",
                bottom: "5%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <SnackbarProvider maxSnack={3}>
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={submitCalendar}
                >
                  submit
                </Button>
              </SnackbarProvider>
            </Box>
          </Box>
        </div>
      </div>
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar
          open={openSuccessAlert}
          autoHideDuration={6000}
          onClose={handleSuccessClose}
        >
          <Alert
            onClose={handleSuccessClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            You have successfully created a calendar!
          </Alert>
        </Snackbar>
      </Stack>
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar
          open={openErrorAlert}
          autoHideDuration={6000}
          onClose={handleErrorClose}
        >
          <Alert
            onClose={handleErrorClose}
            severity="error"
            sx={{ width: "100%" }}
          >
            Something went wrong!
          </Alert>
        </Snackbar>
      </Stack>
      <div>
        <Dialog
          open={openUserInfo}
          onClose={handleUserInfoClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"User Information"}
          </DialogTitle>
          <DialogContent>
            {/* <DialogContentText id="user-info-dialog" > */}
            {dynamicinfodialog()}
            {/* </DialogContentText> */}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleUserInfoClose}>Dismiss</Button>
          </DialogActions>
        </Dialog>
      </div>
    </Box>
  );
}
