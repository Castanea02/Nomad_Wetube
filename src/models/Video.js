//DB 스키마
import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now }, //default = DB 생성시 명시 안 해줘도 됨
  hashtags: [{ type: String }], //Array
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
});

const Video = mongoose.model("Video", videoSchema); //Video 모델 정의

export default Video;
