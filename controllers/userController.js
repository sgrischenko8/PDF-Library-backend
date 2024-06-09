const User = require("../models/userModel");
const File = require("../models/fileModel");
const bcrypt = require("bcrypt");
const path = require("path");
const { unlink } = require("node:fs");

exports.register = async (req, res, next) => {
  req.body.verificationToken = req.session.id;

  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user) {
      await User.deleteOne({ _id: user.id });
    }
    req.body.verify = true;
    await User.create(req.body);

    res.status(201).json("User added successfully");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    if (!req.session.userId) {
      await req.sessionStore.destroy(req.session.id);
    }

    req.session.userId = req.user._id;

    req.session.save((err) => {
      if (err) {
        console.log(err);
        next(err);
      }
    });

    res.status(200).json(req.user);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    await req.sessionStore.destroy(req.session.id);
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.clearCookie("connect.sid");
      res
        .status(200)
        .json("All sessions for the user have been logged out successfully");
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userId).select(
      "-password -verify -verificationToken"
    );
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getUserData = async (req, res, next) => {
  try {
    const files = await File.find({ uploadedBy: req.user._id });
    res.status(200).json({ user: req.user, files });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  const { password } = req.body;
  const oldPhoto = req.user?.photo;
  const photo = req.file?.path;
  try {
    if (oldPhoto && typeof oldPhoto === "string") {
      const currentPhotoPath = path.resolve(oldPhoto);

      unlink(currentPhotoPath, (err) => {
        if (err) console.log(err);
      });
    }
    if (photo) {
      req.body = {
        photo,
      };
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      req.body.password = hashedPassword;
    }

    await User.findByIdAndUpdate({ _id: req.user._id }, req.body).select(
      "-password -verify -verificationToken"
    );

    const updatedUser = Object.assign(req.user, req.body);

    res.status(201).json(updatedUser);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getPing = async (req, res, next) => {
  try {
    res.status(200).json();
  } catch (error) {
    console.log(error);
    next(error);
  }
};
