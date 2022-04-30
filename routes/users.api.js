const express = require("express");
const { body, param, header } = require("express-validator");
const {
  register,
  loginEmailPassword,
  getAllUsers,
  getSingleUserById,
  getCurrentUserProfile,
  updateCurrentUser,
  deactivateCurrentUser,
} = require("../controllers/user.controller");
const { loginRequired } = require("../middlewares/authentication");
const { validate, checkObjectId } = require("../middlewares/validator");
const router = express.Router();

router.post(
  "/register",
  validate([
    body("name", "Invalid name").exists().notEmpty(),
    body("email", "Invalid email").exists().isEmail(),
    body("password", "Invalid password").exists().notEmpty(),
  ]),
  register
);

router.post(
  "/login",
  validate([
    body("email", "Invalid email").exists().isEmail(),
    body("password", "Invalid password").exists().notEmpty(),
  ]),
  loginEmailPassword
);

router.get("/all", getAllUsers);

router.get(
  "/:id",
  validate([param("id").exists().isString().custom(checkObjectId)]),
  getSingleUserById
);

router.get(
  "/me/get",
  validate([header("authorization").exists().isString()]),
  loginRequired,
  getCurrentUserProfile
);

router.put("/me/update", loginRequired, updateCurrentUser);

router.delete("/me/deactivate", loginRequired, deactivateCurrentUser);

module.exports = router;
