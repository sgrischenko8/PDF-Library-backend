const { Router } = require("express");

const { userController } = require("../../controllers");
const { userMiddleware } = require("../../middlewares");

const router = Router();

router
  .route("/register")
  .post(
    userMiddleware.checkUserData,
    userMiddleware.checkIsEmailAlreadyUsed,
    userController.register
  );
router
  .route("/login")
  .post(
    userMiddleware.checkVerification,
    userMiddleware.checkUserData,
    userMiddleware.IsEmailAndPasswordFit,
    userController.login
  );
router
  .route("/current")
  .get(userMiddleware.checkCookie, userController.getCurrentUser);
router.route("/ping").get(userController.getPing);
router.route("/logout").post(userMiddleware.checkCookie, userController.logout);
router.use("/:id", userMiddleware.checkCookie, userMiddleware.checkUserId);
router
  .route("/:id")
  .get(userController.getUserData)
  .patch(userMiddleware.checkAbsenceBodyInPatch, userController.updateUser);
router
  .route("/:id/photo")
  .patch(userMiddleware.checkFile, userController.updateUser);

module.exports = router;
