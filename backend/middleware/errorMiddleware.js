const errorHandler = (err, req, res, next) => {
  const stat = res.statusCode ? res.statusCode : 500;
  if (stat === 200) {
    res.status(400);
  }
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
module.exports = { errorHandler };
