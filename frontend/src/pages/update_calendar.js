/* eslint-disable */
import Button from "@mui/material/Button";
import { useRef, useState } from "react";
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
import "../style/update_calendar.css";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Link, useNavigate } from "react-router-dom";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
const drawerWidth = 240;
import TextField from "@mui/material/TextField";
import purple from "@material-ui/core/colors/purple";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import MultipleSelectCheckmarks from "../components/multiple_selector";
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

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Calendar_update() {
  //once click submit, update calendar++++++++++++++++++++++++++++++++++++
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const [selecteduser, setselecteduser] = useState([]);
  const [selecteduserid, setselecteduserid] = useState([]);

  const selectedUserRef = useRef();
  const selectedUserIdRef = useRef();

  const navigate = useNavigate();

  React.useEffect(() => {
    selectedUserRef.current = selecteduser;
    selectedUserIdRef.current = selecteduserid;
  }, [selecteduser, selecteduserid]);

  React.useEffect(() => {
    inputRef.current = inputValue;
  }, [inputValue]);

  //----------------------user info dialog-----------------------------------

  const handleUserInfoOpen = () => {
    setOpenUserInfo(true);
  };

  const handleUserInfoClose = () => {
    setOpenUserInfo(false);
  };
  //------------------------------------user info dialog-----------------------------
  const [openUserInfo, setOpenUserInfo] = useState(false);
  function dynamicinfodialog() {
    try {
      axios
        .get("/user/get", {
          withCredentials: true,
        })
        .then((response) => {
          localStorage.setItem("curuser", response.data.username);
          localStorage.setItem("curemail", response.data.email);
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

  //-------------------------------alert------------------------------------
  const [openSuccessAlert, setOpenSuccessAlert] = React.useState(false);
  const [openErrorAlert, setOpenErrorAlert] = React.useState(false);

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
  //-----------------------------------------------------------------

  // click on submit button
  const submitCalendar = (event) => {
    event.preventDefault();
    const currCalendar = JSON.parse(localStorage.getItem("currCalendar"));
    const isFoundPersonal = JSON.parse(localStorage.getItem("isFoundPersonal"));
    setInputValue(currCalendar.title);
    if (!isFoundPersonal) {
      // TODO: bug fix: not all selected user are added to the calendar
      //PATCH /api/groupCalendar/:id/changeTitle
      if (inputRef.current !== "") {
        axios
          .patch(
            `groupCalendar/${currCalendar._id}/changeTitle`,
            {
              title: inputRef.current,
            },
            {
              withCredentials: true,
            }
          )
          .then((response) => {
            setOpenSuccessAlert(true);
            // navigate("/");
          })
          .catch((err) => {
            setOpenErrorAlert(true);
            if (err.response.status === 401) {
              navigate("/login");
            }
            console.log(err);
          });
      }

      //PATCH /api/groupCalendar/:id/addParticipant
      if (selectedUserRef.current.length > 0) {
        axios
          .patch(
            `groupCalendar/${currCalendar._id}/addParticipant`,
            {
              participant: selectedUserIdRef.current,
            },
            {
              withCredentials: true,
            }
          )
          .then((response) => {
            setOpenSuccessAlert(true);
          })
          .catch((err) => {
            setOpenErrorAlert(true);
            if (err.response.status === 401) {
              navigate("/login");
            }
            console.log(err);
          });
      }
    } else {
      // update title
      if (inputRef.current !== "") {
        axios
          .patch(
            `/personalCalendar/${currCalendar._id}`,
            { title: inputRef.current },
            {
              withCredentials: true,
            }
          )
          .then((response) => {
            setOpenSuccessAlert(true);
          })
          .catch((err) => {
            setOpenErrorAlert(true);
            if (err.response.status === 401) {
              navigate("/login");
            }
            console.log(err);
          });
      }
    }

    document.getElementById("update_calendar_name").reset();
  };
  //-------------------------------appbar ------------------------------------------------------------
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleCallback = (usernames, userids) => {
    setselecteduser(usernames);
    setselecteduserid(userids);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleInfo = () => {
    // pop up window showing calendar info
    // pop up window showing calendar info
  };

  const handleLogout = () => {
    axios.post("/user/logOut", { withCredentials: true });
    navigate("/login");
  };
  //-------------------------------appbar ------------------------------------------------------------
  //-------------------------------darwer-------------------------------------------------------------

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
          className="update_loc"
          style={{
            position: "absolute",
            left: "47%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Box sx={{ p: 5, top: "100px" }} className="update_calendar">
            <h1 style={{ color: "rgb(156, 39, 176)" }}>Update a Calendar</h1>
            <br />
            <form id="update_calendar_name">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  "& > :not(style)": { m: 1 },
                }}
              >
                <TextField
                  helperText="Please enter your Calendar's name"
                  id="demo-helper-text-misaligned"
                  label="Name"
                  onChange={(event) => setInputValue(event.target.value)}
                />
              </Box>
              {!JSON.parse(localStorage.getItem("isFoundPersonal")) && (
                <MultipleSelectCheckmarks
                  handleCallback={handleCallback}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    "& > :not(style)": { m: 2 },
                  }}
                />
              )}
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
              <Button
                color="secondary"
                variant="contained"
                onClick={submitCalendar}
              >
                submit
              </Button>
            </Box>
          </Box>
        </div>
      </div>
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
            You have successfully updated a calendar!
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
    </Box>
  );
}
