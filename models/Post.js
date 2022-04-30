const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    isDeleted: { type: String, default: false },
  },
  { timestamps: true }
);

const Post = mongoose.model("Posts", postSchema);

module.exports = Post;
