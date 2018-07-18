const errors = require('../config/errors');

const mongoose = require("mongoose");
const { ValidationError } = mongoose.Error;

handlerWatchList = (err, req, res, next) => {
  if(err.name === errors.ExistingWatchList) {
    res.status(400).json({ message: err.message });
    return;
  }
  next(err);
};

handlerSchemaValidationError = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    res.status(400).json(err.message);
  } else {
    next(err);
  }
};

handlerPassportAndToken = (err, req, res, next) => {
  if (err.name === errors.PassportAuthenticationError) {
    if (err.message === "TokenExpiredError") {
      res.status(401).json({
        message: "Token expired. Please sign in again"
      });
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } else if (err.name === errors.TokenMismatch) {
    res.status(401).json({ message: err.message });
  } else {
    next(err);
  }
};

handlerSuperAuthorization = (err, req, res, next) => {
  if(err.name === errors.UnauthorizedSuperRequest) {
    res.status(403).json({ message: err.message });
    return;
  }
  next(err);
};

handler500 = (err, req, res, next) => {
  console.log(err);
  res.status(500).json("Oops! Something went wrong. Please try again later!");
};

handler404 = (req, res, next) => {
  res.status(404).json("Not Found.");
};

module.exports = {
  handlerSchemaValidationError,
  handlerPassportAndToken,
  handlerSuperAuthorization,
  handler404,
  handler500,
  handlerWatchList
};
