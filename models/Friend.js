const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const friendSchema = Schema(
  {
    from: { type: Schema.ObjectId, required: true, ref: "User" }, //Requestor
    to: { type: Schema.ObjectId, required: true, ref: "User" }, //Receiver
    status: { type: String, enum: ["pending", "accepted", "declined"] },
  },
  { timestamp: true }
);

const Friend = mongoose.model("Friend", friendSchema);
module.exports = Friend;
