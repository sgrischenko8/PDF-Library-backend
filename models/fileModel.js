const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    originalname: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    path: { type: String, required: true },
    uploadDate: { type: Date, default: Date.now },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    uploadedByUser: { type: String, required: true },
    numberOfPages: { type: Number, required: true },
    visibility: { type: Boolean, required: true },
    comment: { type: String },
  },
  { versionKey: false }
);
fileSchema.pre("save", async function (next) {
  next();
});

const File = mongoose.model("File", fileSchema);

module.exports = File;
