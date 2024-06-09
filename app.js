const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const crypto = require("crypto");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const { PDFDocument } = require("pdf-lib");
const fs = require("fs");
dotenv.config({ path: "./environment/.env" });

const filesRouter = require("./routes/api/fileRouter");
const userRouter = require("./routes/api/userRouter");

const app = express();

const secretKey = crypto.randomBytes(32).toString("hex");

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

// middlewares------------------
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser(secretKey));
app.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      collectionName: "sessions",
      ttl: 14 * 24 * 60 * 60,
    }),
    cookie: {
      secure: false,
      httpOnly: process.env.NODE_ENV === "development" ? true : false,
      sameSite: "lax",
      maxAge: 14 * 24 * 60 * 60 * 1000,
    },
  })
);

app.use(logger(formatsLogger));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static("uploads"));
// --------------------------

app.set("trust proxy", 1);

const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replaceAll(" ", "-")}`);
  },
});

const upload = multer({ storage: storage });

app.patch(
  "/users/:id/photo",
  upload.single("photo"),
  async (req, res, next) => {
    try {
      if (!req.file.mimetype.startsWith("image")) {
        return res.status(400).json({
          message: "Incorrect type of image. Please, upload .jpg or png",
        });
      }

      next();
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).send(error.message);
    }
  }
);
app.use("/users", userRouter);

// middleware for uploadinf PDF
app.post("/api/files", upload.single("file"), async (req, res, next) => {
  try {
    // Чтение загруженного файла
    const pdfBuffer = fs.readFileSync(req.file.path);

    // Открытие PDF документа
    const pdfDoc = await PDFDocument.load(pdfBuffer);

    // Получение количества страниц
    req.pageCount = pdfDoc.getPageCount();

    if (req.file.originalname.slice(-3).toLowerCase() !== "pdf") {
      return res.status(400).json({
        message: "Incorrect type of image. Please, upload .pdf file",
      });
    }

    next();
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send(error.message);
  }
});
app.use("/api/files", filesRouter);

app.all("*", (req, res) => {
  console.log("such page not foundnd");
  res.status(404).json({ message: "Bad request. Page not found" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  console.log(err, "err");
  res.status(err.status || 500).json({ message: err.message });
});

module.exports = app;
