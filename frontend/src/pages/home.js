/* eslint-disable */
import * as React from "react";
import {
  useEffect,
  useRef,
  useState,
  Fragment,
  useCallback,
  useMemo,
} from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import GroupsIcon from "@mui/icons-material/Groups";
import AccountCircle from "@mui/icons-material/AccountCircle";
import InfoIcon from "@mui/icons-material/Info";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import TextField from "@mui/material/TextField";
import "react-calendar/dist/Calendar.css";
import "../style/home.css";
import Button from "@mui/material/Button";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../style/calendar.css";
import axios from "../api/axios";
import { createTheme } from "@material-ui/core/styles";
import purple from "@material-ui/core/colors/purple";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const { io } = require("socket.io-client");
const socket = io("http://localhost:3000");
// const socket = io.connect();

const theme = createTheme({
  typography: {
    fontFamily: "Raleway, Arial",
    fontSize: 12,
  },
});
const drawerWidth = 240;
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
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

export default function Home() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  //-------------------------------calendar test------------------------------------------------------
  const localizer = momentLocalizer(moment);

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [personalCalendar, setPersonalCalendars] = useState([]);
  const [groupCalendar, setGroupCalendars] = useState([]);
  const [currentCalendar, setCurrentCalendar] = useState([]);

  const personalCalenarRef = useRef();
  const groupCalendarRef = useRef();
  const eventsRef = useRef();
  const currCalendarRef = useRef();
  const selectedEventRef = useRef();

  const navigate = useNavigate();
  let isFoundPersonal = JSON.parse(localStorage.getItem("isFoundPersonal"));
  // const { currCalendar } = useContext(CalendarContext);
  // const { setCurrCalendar } = useContext(CalendarContext);

  socket.on("connect", () => {
    console.log("connected");
    socket.on("updateEvents", (data) => {
      // get all events from the current calendar
      console.log("new event created in the group calendar");
      axios
        .get(`/groupCalendar/${data.calendarId}/todo`, {
          withCredentials: true,
        })
        .then((res) => {
          setEvents(res.data);
        });
    });
  });

  //-------------------------------create event alert------------------------------------
  const [openEmptyAlert, setOpenEmptyAlert] = React.useState(false);

  const handleEmptyClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenEmptyAlert(false);
  };
  //-------------------------------create event alert------------------------------------
  const [openSuccessAlert, setOpenSuccessAlert] = React.useState(false);
  const [openErrorAlert, setOpenErrorAlert] = React.useState(false);

  const handleSuccessClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSuccessAlert(false);
  };

  //-------------------------------update event alert------------------------------------
  const [openSuccessUpdateAlert, setOpenSuccessUpdateAlert] = React.useState(
    false
  );

  const handleSuccessUpdateClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSuccessUpdateAlert(false);
  };

  //-------------------------------delete event alert------------------------------------
  const [openSuccessDeleteAlert, setOpenSuccessDeleteAlert] = React.useState(
    false
  );

  const handleSuccessDeleteClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSuccessDeleteAlert(false);
  };

  //-------------------------------delete calendar alert------------------------------------
  const [
    openSuccessDeleteCalendarAlert,
    setOpenSuccessDeleteCalendarAlert,
  ] = React.useState(false);

  const handleSuccessDeleteCalendarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSuccessDeleteCalendarAlert(false);
  };
  //-------------------------------general error alert----------------------
  const handleErrorClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenErrorAlert(false);
  };

  //----------------------user info dialog-----------------------------------

  const handleUserInfoOpen = () => {
    setOpenUserInfo(true);
  };

  const handleUserInfoClose = () => {
    setOpenUserInfo(false);
  };

  //------------------------------------delete calendar dialog--------------------------
  const [openDeleteCalendar, setOpenDeleteCalendar] = React.useState(false);

  const handleClickOpenDeleteCalendar = () => {
    setOpenDeleteCalendar(true);
  };

  const handleCloseOpenDeleteCalendar = () => {
    setOpenDeleteCalendar(false);
  };

  const deleteCalendarHook = () => {
    // delete calendar from db+++++++++++++++++++++++++++++
    isFoundPersonal = JSON.parse(localStorage.getItem("isFoundPersonal"));
    ``;
    if (isFoundPersonal && personalCalenarRef.current.length > 1) {
      try {
        // delete todos in this calendar
        axios
          .delete(
            "/personalCalendar/" + currCalendarRef.current._id + "/todo",
            {
              withCreditentials: true,
            }
          )
          .then((response) => {
            // delete calendar
            axios
              .delete("/personalCalendar/" + currCalendarRef.current._id, {
                withCreditentials: true,
              })
              .then((res) => {
                setPersonalCalendars(
                  personalCalenarRef.current.filter((calendar) => {
                    return calendar._id !== currCalendarRef.current._id;
                  })
                );
                setOpenSuccessDeleteCalendarAlert(true);
                setCurrentCalendar(personalCalenarRef.current[0]);
                navigate("/home");
              });
          })
          .catch((error) => {
            setOpenErrorAlert(true);
            if (error.response.status === 401) {
              navigate("/login");
            }
            console.log(error);
          });
      } catch (error) {
        setOpenErrorAlert(true);
        console.log(error);
      }
    } else {
      try {
        // delete all todo in this calendar
        axios
          .delete("/groupCalendar/" + currCalendarRef.current._id + "/todo", {
            withCreditentials: true,
          })

          .then((res) => {
            // delete this calendar from db
            axios
              .delete("/groupCalendar/" + currCalendarRef.current._id, {
                withCreditentials: true,
              })
              .then((response) => {
                setGroupCalendars(
                  groupCalendarRef.current.filter((calendar) => {
                    return calendar._id !== currCalendarRef.current._id;
                  })
                );
                setOpenSuccessDeleteCalendarAlert(true);
                setCurrentCalendar(personalCalenarRef.current[0]);
                navigate("/home");
              });
          })
          .catch((error) => {
            setOpenErrorAlert(true);
            if (error.response.status === 401) {
              navigate("/login");
            }
            console.log(error);
          });
      } catch (error) {
        setOpenErrorAlert(true);
        console.log(error);
      }
    }

    setOpenDeleteCalendar(false);
  };

  //------------------------------------delete event dialog--------------------------

  const [openDeleteEvent, setOpenDeleteEvent] = React.useState(false);

  const handleClickOpenDeleteEvent = () => {
    setOpenDeleteEvent(true);
  };

  const handleCloseOpenDeleteEvent = () => {
    setOpenDeleteEvent(false);
  };

  const deleteEventHook = () => {
    const isFoundPersonal = JSON.parse(localStorage.getItem("isFoundPersonal"));
    const isFoundGroup = !isFoundPersonal;

    document.getElementById("onclickEvent").hidden = true;
    if (isFoundPersonal) {
      let currentEventId = selectedEventRef.current._id;
      try {
        axios
          .delete(
            "/personalCalendar/" +
              currCalendarRef.current._id +
              "/todo/" +
              currentEventId,
            { withCreditentials: true }
          )
          .then((response) => {
            const temp_events = events.filter(
              (event) => event._id !== currentEventId
            );
            setEvents(temp_events);
            setOpenSuccessDeleteAlert(true);
          })
          .catch((error) => {
            setOpenErrorAlert(true);
            if (error.response.status === 401) {
              navigate("/login");
            }
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    } else if (isFoundGroup) {
      let currentEventId = selectedEventRef.current._id;
      socket.emit("updateEvents", {
        calendarId: currCalendarRef.current._id,
      });
      try {
        axios
          .delete(
            "/groupCalendar/" +
              currCalendarRef.current._id +
              "/todo/" +
              currentEventId,
            { withCreditentials: true }
          )
          .then((response) => {
            const temp_events = events.filter(
              (event) => event._id !== currentEventId
            );
            setEvents(temp_events);
            setOpenSuccessDeleteAlert(true);
          })
          .catch((error) => {
            setOpenErrorAlert(true);
            if (error.response.status === 401) {
              navigate("/login");
            }
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    }
    setOpenDeleteEvent(false);
  };

  //------------------------------------update event dialog--------------------------
  const [openUpdateEvent, setopenUpdateEvent] = React.useState(false);
  const [updateEventValue, setUpdateEventValue] = useState("");
  const handleClickOpenUpdateEvent = () => {
    setopenUpdateEvent(true);
  };

  const handleCloseUpdateEvent = () => {
    setopenUpdateEvent(false);
  };

  const UpdateEventHook = () => {
    const title = updateEventValue;
    const isFoundPersonal = JSON.parse(localStorage.getItem("isFoundPersonal"));
    const isFoundGroup = !isFoundPersonal;
    if (title) {
      if (isFoundPersonal) {
        let currentEventId = selectedEventRef.current._id;
        try {
          const start = new Date(selectedEventRef.current.start);
          const end = new Date(selectedEventRef.current.end);
          axios
            .patch(
              "/personalCalendar/" +
                currCalendarRef.current._id +
                "/todo/" +
                currentEventId,
              { title: title, start: start, end: end },
              { withCreditentials: true }
            )
            .then((response) => {
              axios
                .get(
                  "/personalCalendar/" + currCalendarRef.current._id + "/todo",
                  {
                    withCreditentials: true,
                  }
                )
                .then((response) => {
                  for (let i = 0; i < response.data.length; i++) {
                    response.data[i]["start"] = moment(
                      response.data[i]["start"]
                    ).toDate();
                    response.data[i]["end"] = moment(
                      response.data[i]["end"]
                    ).toDate();
                  }
                  setEvents(response.data);
                  setOpenSuccessUpdateAlert(true);
                })
                .catch((error) => {
                  setOpenErrorAlert(true);
                  if (error.response.status === 401) {
                    navigate("/login");
                  }
                  console.log(error);
                });
            })
            .catch((error) => {
              setOpenErrorAlert(true);
              if (error.response.status === 401) {
                navigate("/login");
              }
              console.log(error);
            });
        } catch (error) {
          setOpenErrorAlert(true);
          console.log(error);
        }
      } else if (isFoundGroup) {
        let currentEventId = selectedEventRef.current._id;
        try {
          socket.emit("updateEvents", {
            calendarId: currCalendarRef.current._id,
          });
          const start = new Date(selectedEventRef.current.start);
          const end = new Date(selectedEventRef.current.end);
          axios
            .patch(
              "/groupCalendar/" +
                currCalendarRef.current._id +
                "/todo/" +
                currentEventId,
              { title: title, start: start, end: end },
              { withCreditentials: true }
            )
            .then((response) => {
              axios
                .get(
                  "/groupCalendar/" + currCalendarRef.current._id + "/todo",
                  {
                    withCreditentials: true,
                  }
                )
                .then((response) => {
                  for (let i = 0; i < response.data.length; i++) {
                    response.data[i]["start"] = moment(
                      response.data[i]["start"]
                    ).toDate();
                    response.data[i]["end"] = moment(
                      response.data[i]["end"]
                    ).toDate();
                  }
                  setEvents(response.data);
                  setOpenSuccessUpdateAlert(true);
                })
                .catch((error) => {
                  setOpenErrorAlert(true);
                  if (error.response.status === 401) {
                    navigate("/login");
                  }
                  console.log(error);
                });
            })
            .catch((error) => {
              setOpenErrorAlert(true);
              if (error.response.status === 401) {
                navigate("/login");
              }
              console.log(error);
            });
        } catch (error) {
          setOpenErrorAlert(true);
          console.log(error);
        }
      }
      setopenUpdateEvent(false);
    }
  };
  //------------------------------------create event dialog--------------------------
  const [openCreateEvent, setopenCreateEvent] = React.useState(false);
  const [CreateEventValue, setCreateEventValue] = useState("");

  const handleClickOpenCreateEvent = ({ start, end }) => {
    localStorage.setItem("startTime", start);
    localStorage.setItem("endTime", end);
    setopenCreateEvent(true);
  };

  const handleCloseCreateEvent = () => {
    setopenCreateEvent(false);
  };

  const createEventHook = () => {
    const start = localStorage.getItem("startTime");
    const end = localStorage.getItem("endTime");
    const title = CreateEventValue;
    const isFoundPersonal = JSON.parse(localStorage.getItem("isFoundPersonal"));
    const isFoundGroup = !isFoundPersonal;
    if (title) {
      if (isFoundPersonal) {
        try {
          axios
            .post(
              "/personalCalendar/" + currCalendarRef.current._id + "/todo",
              {
                start: start,
                end: end,
                title: title,
              },
              { withCreditentials: true }
            )
            .then((response) => {
              axios
                .get(
                  "/personalCalendar/" + currCalendarRef.current._id + "/todo",
                  {
                    withCreditentials: true,
                  }
                )
                .then((response) => {
                  for (let i = 0; i < response.data.length; i++) {
                    response.data[i]["start"] = moment(
                      response.data[i]["start"]
                    ).toDate();
                    response.data[i]["end"] = moment(
                      response.data[i]["end"]
                    ).toDate();
                  }
                  setEvents(response.data);
                  setOpenSuccessAlert(true);
                })
                .catch((error) => {
                  setOpenErrorAlert(true);
                  if (error.response.status === 401) {
                    navigate("/login");
                  }
                  console.log(error);
                });
            })
            .catch((error) => {
              setOpenErrorAlert(true);
              if (error.response.status === 401) {
                navigate("/login");
              }
              console.log(error);
            });
        } catch (error) {
          setOpenErrorAlert(true);
          console.log(error);
        }
      }
      if (isFoundGroup) {
        try {
          socket.emit("updateEvents", {
            calendarId: currCalendarRef.current._id,
          });
          axios
            .post(
              "/groupCalendar/" + currCalendarRef.current._id + "/todo",
              {
                start: start,
                end: end,
                title: title,
              },
              { withCreditentials: true }
            )
            .then((response) => {
              axios
                .get(
                  "/groupCalendar/" + currCalendarRef.current._id + "/todo",
                  {
                    withCreditentials: true,
                  }
                )
                .then((response) => {
                  for (let i = 0; i < response.data.length; i++) {
                    response.data[i]["start"] = moment(
                      response.data[i]["start"]
                    ).toDate();
                    response.data[i]["end"] = moment(
                      response.data[i]["end"]
                    ).toDate();
                  }
                  setEvents(response.data);
                })
                .catch((error) => {
                  setOpenErrorAlert(true);
                  if (error.response.status === 401) {
                    navigate("/login");
                  }
                  console.log(error);
                });
            })
            .catch((error) => {
              setOpenErrorAlert(true);
              if (error.response.status === 401) {
                navigate("/login");
              }
              console.log(error);
            });
        } catch (error) {
          setOpenErrorAlert(true);
          console.log(error);
        }
      }
    }
    setopenCreateEvent(false);
  };

  //----------------------------------------------------------------------------------

  // monitor for changes in the personal/group calendars
  useEffect(() => {
    personalCalenarRef.current = personalCalendar;
    groupCalendarRef.current = groupCalendar;
  }, [personalCalendar, groupCalendar]);

  // monitor for changes in the current calendar
  useEffect(() => {
    currCalendarRef.current = currentCalendar;
    localStorage.setItem("currCalendar", JSON.stringify(currentCalendar));
    isFoundPersonal = personalCalendar.some((calendar) => {
      if (calendar._id === currCalendarRef.current._id) {
        return true;
      }

      return false;
    });
    if (!isFoundPersonal && currCalendarRef.current) {
      socket.emit("calendarChanged", {
        calendarId: currCalendarRef.current._id,
      });
    }
    localStorage.setItem("isFoundPersonal", JSON.stringify(isFoundPersonal));
  }, [currentCalendar]);

  useEffect(() => {
    selectedEventRef.current = selectedEvent;
  }, [selectedEvent]);

  useEffect(() => {
    eventsRef.current = events;
  }, [events]);

  //-------------------------------------------------------------------------------------------------

  //getting all calendars
  useEffect(() => {
    axios
      .get("/personalCalendar", {
        withCreditentials: true,
      })
      .then((response) => {
        setPersonalCalendars(
          response.data,
          setCurrentCalendar(response.data[0])
        );
      })
      .catch((error) => {
        setOpenErrorAlert(true);
        if (error.response.status === 401) {
          navigate("/login");
        }
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("/groupCalendar", {
        withCreditentials: true,
      })
      .then((response) => {
        //GET /api/groupCalendar/joined
        axios
          .get("/groupCalendar/joined", { withCredentials: true })
          .then((res) => {
            setGroupCalendars([...response.data, ...res.data]);
          });
      })
      .catch((error) => {
        setOpenErrorAlert(true);
        if (error.response.status === 401) {
          navigate("/login");
        }
        console.log(error);
      });
  }, []);

  // setting the initial currCalendar to the default calendar
  useEffect(() => {
    if (personalCalendar.length > 0) {
      setCurrentCalendar(personalCalendar[0]);
      localStorage.setItem("currCalendar", JSON.stringify(personalCalendar[0]));
      axios
        .get("/personalCalendar/" + currCalendarRef.current._id + "/todo", {
          withCreditentials: true,
        })
        .then((response) => {
          for (let i = 0; i < response.data.length; i++) {
            response.data[i]["start"] = moment(
              response.data[i]["start"]
            ).toDate();
            response.data[i]["end"] = moment(response.data[i]["end"]).toDate();
          }
          setEvents(response.data);
        })
        .catch((error) => {
          setOpenErrorAlert(true);
          if (error.response.status === 401) {
            navigate("/login");
          }
          console.log(error);
        });
    }
  }, []);

  //getting all events for this calendar

  useEffect(() => {
    isFoundPersonal = JSON.parse(localStorage.getItem("isFoundPersonal"));

    if (isFoundPersonal && currCalendarRef.current._id) {
      axios
        .get(`/personalCalendar/${currCalendarRef.current._id}/todo`, {
          withCreditentials: true,
        })
        .then((response) => {
          for (let i = 0; i < response.data.length; i++) {
            response.data[i]["start"] = moment(
              response.data[i]["start"]
            ).toDate();
            response.data[i]["end"] = moment(response.data[i]["end"]).toDate();
          }
          setEvents(response.data);
        })
        .catch((error) => {
          setOpenErrorAlert(true);
          if (error.response.status === 401) {
            navigate("/login");
          }
          console.log(error);
        });
    }
    if (!isFoundPersonal && currCalendarRef.current._id) {
      axios
        .get("/groupCalendar/" + currCalendarRef.current._id + "/todo", {
          withCreditentials: true,
        })
        .then((response) => {
          for (let i = 0; i < response.data.length; i++) {
            response.data[i]["start"] = moment(
              response.data[i]["start"]
            ).toDate();
            response.data[i]["end"] = moment(response.data[i]["end"]).toDate();
          }
          setEvents(response.data);
        })
        .catch((error) => {
          setOpenErrorAlert(true);
          if (error.response.status === 401) {
            navigate("/login");
          }
          console.log(error);
        });
    }
  }, [currentCalendar]);

  //Clicking an existing event
  function onSelectEvent(pEvent) {
    setSelectedEvent(pEvent);
    document.getElementById("onclickEvent").hidden =
      document.getElementById("onclickEvent").hidden === true ? false : true;
  }
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
    if (curcal !== null) {
      return (
        <div>
          username: {user}
          <br />
          email: {email}
          <br />
          calendar: {curcal.title}
        </div>
      );
    } else {
      return (
        <div>
          username: {user}
          <br />
          email: {email}
          <br />
          calendar: error: current calendar undfined
        </div>
      );
    }
  }

  function deleteCalendar() {
    // delete calendar from db+++++++++++++++++++++++++++++
    const r = window.confirm("Would you like to remove this calendar?");
    isFoundPersonal = JSON.parse(localStorage.getItem("isFoundPersonal"));
    ``;
    if (r) {
      if (isFoundPersonal && personalCalenarRef.current.length > 1) {
        try {
          // delete todos in this calendar
          axios
            .delete(
              "/personalCalendar/" + currCalendarRef.current._id + "/todo",
              {
                withCreditentials: true,
              }
            )
            .then((response) => {
              // delete calendar
              axios
                .delete("/personalCalendar/" + currCalendarRef.current._id, {
                  withCreditentials: true,
                })
                .then((res) => {
                  setPersonalCalendars(
                    personalCalenarRef.current.filter((calendar) => {
                      return calendar._id !== currCalendarRef.current._id;
                    })
                  );
                  setCurrentCalendar(personalCalenarRef.current[0]);
                  navigate("/home");
                });
            })
            .catch((error) => {
              setOpenErrorAlert(true);
              if (error.response.status === 401) {
                navigate("/login");
              }
              console.log(error);
            });
        } catch (error) {
          setOpenErrorAlert(true);
          console.log(error);
        }
      } else {
        try {
          // delete all todo in this calendar
          axios
            .delete("/groupCalendar/" + currCalendarRef.current._id + "/todo", {
              withCreditentials: true,
            })

            .then((res) => {
              // delete this calendar from db
              axios
                .delete("/groupCalendar/" + currCalendarRef.current._id, {
                  withCreditentials: true,
                })
                .then((response) => {
                  setGroupCalendars(
                    groupCalendarRef.current.filter((calendar) => {
                      return calendar._id !== currCalendarRef.current._id;
                    })
                  );
                  setCurrentCalendar(personalCalendarRef.current[0]);
                  navigate("/home");
                });
            })
            .catch((error) => {
              setOpenErrorAlert(true);
              if (error.response.status === 401) {
                navigate("/login");
              }
              console.log(error);
            });
        } catch (error) {
          setOpenErrorAlert(true);
          console.log(error);
        }
      }
    }
  }

  const handleSelectEvent = useCallback((event) => {
    onSelectEvent(event);
  }, []);

  const { defaultDate, scrollToTime } = useMemo(
    () => ({
      defaultDate: new Date(),
      scrollToTime: new Date(1970, 1, 1, 6),
    }),
    []
  );
  //-------------------------------calendar test------------------------------------------------------
  //-------------------------------appbar ------------------------------------------------------------
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleInfo = () => {
    // pop up window showing calendar info
    try {
      axios
        .get("/user/get", {
          withCreditentials: true,
        })
        .then((response) => {
          window.alert(
            "username: " +
              response.data.username +
              "\n" +
              "user's email: " +
              response.data.email +
              "\n" +
              "current calendar: " +
              currCalendarRef.current.title
          );
        });
    } catch (error) {
      setOpenErrorAlert(true);
      console.log(error);
    }
  };

  //-------------------------------appbar ------------------------------------------------------------
  //-------------------------------darwer-------------------------------------------------------------

  const handleDrawerOpen = () => {
    document.getElementById("profileIcon").hidden = true;
    document.getElementById("todolist").hidden = true;
    document.getElementById("infoIcon").hidden = true;
    setOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Logout button
  const handleLogout = () => {
    axios.post("/user/logOut", { withCreditentials: true });
    navigate("/login");
  };

  const handleDrawerClose = () => {
    document.getElementById("profileIcon").hidden = false;
    document.getElementById("infoIcon").hidden = false;
    document.getElementById("todolist").hidden = false;
    setOpen(false);
  };

  //-------------------------------darwer-------------------------------------------------------------
  return (
    <Box>
      <AppBar position="static" open={open} style={{ background: "#FFFFFF" }}>
        <Toolbar>
          <IconButton
            style={{ color: purple[300] }}
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
            size="large"
          >
            <MenuIcon />
          </IconButton>
          <div className="appbar-right"></div>
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

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {personalCalendar.map((item, index) => (
            <ListItem
              key={item._id}
              disablePadding
              onClick={() => setCurrentCalendar(personalCalendar[index])}
            >
              <ListItemButton>
                <ListItemIcon style={{ color: purple[900] }}>
                  {<CalendarMonthIcon />}
                </ListItemIcon>
                <ListItemText
                  style={{ color: purple[600] }}
                  primary={item.title}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {groupCalendar.map((item, index) => (
            <ListItem
              key={item._id}
              disablePadding
              onClick={() => setCurrentCalendar(groupCalendar[index])}
            >
              <ListItemButton>
                <ListItemIcon style={{ color: purple[900] }}>
                  {<GroupsIcon />}
                </ListItemIcon>
                <ListItemText
                  style={{ color: purple[600] }}
                  primary={item.title}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <div className="row">
        <div className="left-panel box"></div>
        <div className="middle-panel box">
          <Box className="calendar" sx={{ m: 2 }}>
            <Fragment>
              <div className="height">
                <Calendar
                  className="calendar_object"
                  defaultDate={defaultDate}
                  events={events}
                  localizer={localizer}
                  onSelectEvent={handleSelectEvent}
                  onSelectSlot={handleClickOpenCreateEvent}
                  selectable
                  components={{}}
                  scrollToTime={scrollToTime}
                  style={{
                    height: 600,
                    width: "100%",
                    color: "rgb(74 0 164)",
                    border: "#000000",
                  }}
                />
              </div>
            </Fragment>
          </Box>
        </div>
        <div className="right-panel box" id="todolist">
          <Box sx={{ p: 3 }} className="right_calendar">
            <div className="text__margin">
              <h2 style={{ color: "rgb(74 0 164)" }}>
                More about the Calendar
              </h2>
            </div>
            <Box sx={{ m: 2 }}>
              <Button
                color="secondary"
                variant="outlined"
                component={Link}
                to="/Calendar_create"
              >
                Create Calendar
              </Button>
            </Box>
            <Box sx={{ m: 2 }}>
              <Button
                color="secondary"
                variant="outlined"
                component={Link}
                to="/Calendar_update"
              >
                Update Calendar
              </Button>
            </Box>
            <Box sx={{ m: 2 }}>
              <Button
                color="secondary"
                variant="outlined"
                onClick={handleClickOpenDeleteCalendar}
              >
                Delete Calendar
              </Button>
            </Box>
          </Box>
          <div id="onclickEvent" hidden>
            <Box sx={{ p: 3 }} className="right_event">
              <h2 style={{ color: "rgb(74 0 164)" }}>More about the Event</h2>
              <Box sx={{ m: 2 }}>
                <Button
                  color="secondary"
                  variant="outlined"
                  onClick={handleClickOpenDeleteEvent}
                >
                  Delete Event
                </Button>
              </Box>
              <Box sx={{ m: 2 }}>
                <Button
                  color="secondary"
                  variant="outlined"
                  onClick={handleClickOpenUpdateEvent}
                >
                  Update Event
                </Button>
              </Box>
            </Box>
          </div>
        </div>
      </div>

      <div>
        <Dialog
          open={openDeleteEvent}
          onClose={handleCloseOpenDeleteEvent}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Delete Event"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Would you like to delete this event?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseOpenDeleteEvent}>Dismiss</Button>
            <Button onClick={deleteEventHook} autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <div>
        <Dialog
          open={openDeleteCalendar}
          onClose={handleCloseOpenDeleteCalendar}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Delete Calendar"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Would you like to delete this calendar?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseOpenDeleteCalendar}>Dismiss</Button>
            <Button onClick={deleteCalendarHook} autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>
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
      <div>
        <Dialog open={openUpdateEvent} onClose={handleCloseUpdateEvent}>
          <DialogTitle>Update Event Name</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Name"
              type="text"
              fullWidth
              variant="standard"
              onChange={(event) => setUpdateEventValue(event.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseUpdateEvent}>Cancel</Button>
            <Button onClick={UpdateEventHook}>Submit</Button>
          </DialogActions>
        </Dialog>
      </div>
      <div>
        <Dialog open={openCreateEvent} onClose={handleCloseCreateEvent}>
          <DialogTitle>Create Event Name</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Name"
              type="text"
              fullWidth
              variant="standard"
              onChange={(event) => setCreateEventValue(event.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCreateEvent}>Cancel</Button>
            <Button onClick={createEventHook}>Submit</Button>
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
            You have successfully created a event!
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
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar
          open={openSuccessUpdateAlert}
          autoHideDuration={6000}
          onClose={handleSuccessUpdateClose}
        >
          <Alert
            onClose={handleSuccessUpdateClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            You have successfully updated a event!
          </Alert>
        </Snackbar>
      </Stack>
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar
          open={openSuccessDeleteAlert}
          autoHideDuration={6000}
          onClose={handleSuccessDeleteClose}
        >
          <Alert
            onClose={handleSuccessDeleteClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            You have successfully deleted a event!
          </Alert>
        </Snackbar>
      </Stack>
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar
          open={openSuccessDeleteCalendarAlert}
          autoHideDuration={6000}
          onClose={handleSuccessDeleteCalendarClose}
        >
          <Alert
            onClose={handleSuccessDeleteCalendarClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            You have successfully deleted a calendar!
          </Alert>
        </Snackbar>
      </Stack>

      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar
          open={openEmptyAlert}
          autoHideDuration={6000}
          onClose={handleEmptyClose}
        >
          <Alert
            onClose={handleEmptyClose}
            severity="warning"
            sx={{ width: "100%" }}
          >
            You have to have at least one calendar!
          </Alert>
        </Snackbar>
      </Stack>
    </Box>
  );
}
