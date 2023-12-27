import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, require: true, ref: "User" },
  video: { type: mongoose.Schema.Types.ObjectId, require: true, ref: "Video" },
  socialOnly: { type: Boolean, default: false },
  avatarUrl: { type: String },
  createdAt: { type: Date, required: true, default: Date.now }, //default = DB 생성시 명시 안 해줘도 됨
});

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
