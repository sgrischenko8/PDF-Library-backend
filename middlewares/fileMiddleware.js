const File = require("../models/fileModel");

exports.checkFileId = async (req, res, next) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "Not found" });
    }
    req.file = file;
    next();
  } catch (error) {
    if (error.reason) {
      return res.status(404).json({ message: "Not found" });
    }
    console.log(error);
    res.sendStatus(500);
  }
};

exports.checkFile = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      message: "Please, upload file!",
    });
  }

  try {
    next();
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send(error.message);
  }
};
