const { userValidator } = require("../utils");

const mongoose = require("mongoose");
const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");

exports.checkUserData = async (req, res, next) => {
  const { error } = userValidator.checkUserDataValidator.validate(req.body);

  if (error) {
    console.log(error);
    const empty = error.details.find(
      (el) => el.type === "string.empty" || el.type === "any.required"
    );
    if (empty) {
      return res.status(400).json({
        message: `missing required ${empty.context.label} field`,
      });
    }
    if (error.details[0].type === "string.email") {
      return res.status(400).send({
        message: "email must be a valid",
      });
    } else {
      const message = error.details.map((el) => el.message).join(". ");
      return res.status(400).json({
        message,
      });
    }
  }
  next();
};

exports.checkIsEmailAlreadyUsed = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email }).select(
      "-password -verify -verificationToken"
    );

    if (user && user?.verify === true) {
      return res.status(403).json({
        message: "Your acsess denied",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

exports.checkVerification = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email }).select("-verificationToken");
    if (!user) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }
    if (user.verify !== true) {
      return res.status(401).json({
        message: "Access denied",
      });
    }
    delete user.verify;
    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

exports.IsEmailAndPasswordFit = async (req, res, next) => {
  const { password } = req.body;
  try {
    const IsPasswordValid = await bcrypt.compare(password, req.user.password);

    if (!IsPasswordValid) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    delete req.user._doc.password;
    delete req.user._doc.verify;

    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

exports.checkCookie = async (req, res, next) => {
  if (!req.session.id) {
    res.status(401).send("You need to log in to access this resource");
  }

  try {
    const sessionCollection = mongoose.connection.db.collection("sessions");
    const sessionExists = await sessionCollection.findOne({
      _id: req.session.id,
    });

    if (!sessionExists) {
      console.log("session not exist");
      res.clearCookie("connect.sid");
      return res.status(404).json("User not found");
    }

    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

exports.checkUserId = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password -verify -verificationToken"
    );

    if (!user) {
      return res.status(404).json({ message: "User ot found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

exports.checkAbsenceBodyInPatch = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "missing fields" });
  }

  next();
};

exports.checkFile = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      message: "Please, upload file!",
    });
  }

  next();
};
