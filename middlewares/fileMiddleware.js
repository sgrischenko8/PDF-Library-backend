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

  next();
};

exports.checkBody = async (req, res, next) => {
  if (
    typeof req.body?.visibility === "boolean" &&
    Object.values(req.body).length === 1
  ) {
    next();
  } else {
    return res.status(400).send({
      message:
        "Only the 'visibility' key is allowed to be changed, and it must be a boolean",
    });
  }
};
