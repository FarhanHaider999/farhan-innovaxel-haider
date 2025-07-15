const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  //mongoose Validation Error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      error: "Validation Error",
      message: errors.join(","),
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      error: "Duplicate Error",
      message: "Resource Already Exist",
    });
  }

  // Default error
  res.status(500).json({
    error: "Internal Server Error",
    message: "Something went wrong on the server",
  });
};

module.exports = {
  errorHandler,
};
