const Calendar = require("../models/Personal");
const asyncHandler = require("express-async-handler");
const checkId = asyncHandler(async (req, res, next) => {
  const calendar = await Calendar.findById(req.params.id);
  if (!calendar) {
    res.status(404);
    throw new Error("Personal Calendar not found");
  }
  req.body.calendarId = req.params.id;
  req.body.type = "PERSONAL";
  next();
});
module.exports = { checkId };
