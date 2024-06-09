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
    res.status(201).send(file);
  } catch (error) {
    next(error);
  }
};

exports.removeFile = async (req, res, next) => {
  const { id } = req.params;
  try {
    await File.deleteOne({ _id: id });
    res.status(200).json({ message: "file deleted" });
  } catch (error) {
    res.status(404).json({ message: "Not found" });
    next(error);
  }
};

exports.getFile = async (req, res, next) => {
  try {
    const file = req.file;
    const user = await User.findById(file.uploadedBy._id);
    res.status(200).json({ file, user });
  } catch (error) {
    next(error);
  }
};
exports.getFiles = async (req, res, next) => {
  try {
    const files = await File.find({ visibility: true });
    res.status(200).json(files);
  } catch (error) {
    next(error);
  }
};

exports.updateFile = async (req, res, next) => {
  const { id } = req.params;
  try {
    const currentFile = await File.findByIdAndUpdate({ _id: id }, req.body);
    const updatedFile = Object.assign(currentFile, req.body);

    res.status(201).json(updatedFile);
  } catch (error) {
    next(error);
  }
};