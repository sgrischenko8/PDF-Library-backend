const { Router } = require("express");

const { fileController } = require("../../controllers");
const { fileMiddleware } = require("../../middlewares");
const { userMiddleware } = require("../../middlewares");

const router = Router();

router.use("/", userMiddleware.checkCookie);
router
  .route("/")
  .post(fileMiddleware.checkFile, fileController.uploadFile)
  .get(fileController.getFiles);
router.use("/:id", fileMiddleware.checkFileId);
router
  .route("/:id")
  .get(fileController.getFile)
  .patch(
    fileMiddleware.checkFile,
    fileMiddleware.checkBody,
    fileController.updateFile
  )
  .delete(fileController.removeFile);

module.exports = router;
