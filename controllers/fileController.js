const File = require("../models/fileModel");

const User = require("../models/userModel");

exports.uploadFile = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.userId);
    const fileData = {
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: "application/pdf",
      size: req.file.size,
      path: req.file.path,
      uploadedBy: req.body.userId,
      uploadedByUser: user.name,
      numberOfPages: req.pageCount,
      visibility: false,
      comment: "",
    };

    const file = await File.create(fileData);
    if (req.copy !== req.session.id) {
      console.log("=== its not the same! ====uploadFile=====");
    }

    res.status(201).send(file);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.removeFile = async (req, res, next) => {
  try {
    if (req.file.uploadedBy.toString() !== req.session.userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    await File.deleteOne({ _id: req.params.id });
    if (req.copy !== req.session.id) {
      console.log("=== its not the same! ====removeFile=====");
    }
    res.status(200).json({ message: "file deleted" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Not found" });
    next(error);
  }
};

exports.getFile = async (req, res, next) => {
  try {
    const file = req.file;
    const user = await User.findById(file.uploadedBy._id);
    if (req.copy !== req.session.id) {
      console.log("=== its not the same! ====getFile=====");
    }
    res.status(200).json({ file, user });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.getFiles = async (req, res, next) => {
  try {
    const files = await File.find({ visibility: true });
    if (req.copy !== req.session.id) {
      console.log("=== its not the same! ====getFiles=====");
    }
    res.status(200).json(files);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.updateFile = async (req, res, next) => {
  const { id } = req.params;
  try {
    const currentFile = await File.findByIdAndUpdate({ _id: id }, req.body);
    const updatedFile = Object.assign(currentFile, req.body);
    if (req.copy !== req.session.id) {
      console.log("=== its not the same! ====updateFile=====");
    }
    res.status(201).send(updatedFile);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
