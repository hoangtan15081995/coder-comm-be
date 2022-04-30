const express = require("express");
const app = require("../app");
const router = express.Router();

const userRouter = require("./users.api");
router.use("/users", userRouter);

// const postRouter = require("./posts.api");
// router.use("/posts", postRouter);

// const friendRouter = require("./friends.api");
// router.use("/friends", friendRouter);

// const commentRouter = require("./comments.api");
// router.use("/comments", commentRouter);

module.exports = router;
