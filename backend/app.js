const express = require("express");
const mongoose = require("mongoose");
const dotnv = require("dotenv").config();
const bcrypt = require("bcrypt");
const { errorHandler } = require("./middleware/errorMiddleware");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const http = require("http").Server(app);
const Calendar = require("./models/Group");

const { Server } = require("socket.io");
const io = new Server(http, {
  cors: {
    origin: ["http://localhost:8000"],
  },
});


app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "http://localhost:8000", "https://one-more-thing.studio"],
  })
);

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/api/personalCalendar/", require("./routes/personal.js"));
app.use("/api/groupCalendar/", require("./routes/group.js"));
app.use("/api/user/", require("./routes/user.js"));
app.use(express.json());

console.log(process.env.DB_CONNECTION);
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () => {
  console.log("Mongoose Connected");
});

const database = mongoose.connection;
database.on("error", (error) => {
  console.log(error);
});
database.once("connected", () => {
  console.log("Database Connected");
});
const findParticipant = async (calendarId) => {
  const calendar = await Calendar.findById(calendarId);
  return calendar.participant;
};
// websocket stuff
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("updateEvents", (data) => {
    // broadcast to all other users about the new event
    console.log("events needs update")
    io.to(data.calendarId).emit("updateEvents", data);
  });
  socket.on("calendarChanged", (data) => {
    // broadcast to all other users about the new event
    console.log("joined room", data.calendarId);
    socket.join(data.calendarId);
  });
});

const PORT = process.env.PORT || 3000;
app.use(errorHandler);
app.use(express.static("static"));
http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
