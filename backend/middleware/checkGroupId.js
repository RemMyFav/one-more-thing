const Calendar = require("../models/Group");
const asyncHandler = require("express-async-handler");
const checkId = asyncHandler(async (req, res, next) => {
  const calendar = await Calendar.findById(req.params.id);
  if (!calendar) {
    res.status(404);
    throw new Error("Group CalendarId not found");
  }
  req.body.calendarId = req.params.id;
  req.body.type = "GROUP";
  next();
});
module.exports = { checkId };
