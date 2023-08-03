import express from "express";
import {
  watch,
  getEdit,
  postEdit,
  getUpload,
  postUpload,
} from "../controllers/videoController";

const videoRouter = express.Router();

//정규식이 없는 함수는 항상 위에 위치할 것 (아니라면 id 파라미터로 인식)
videoRouter.get("/:id(\\d+)", watch); //id 파라미터 요청 (\\d+) -> 숫자만 정규표현식
videoRouter.route("/:id(\\d+)/edit").get(getEdit).post(postEdit);
videoRouter.route("/upload").get(getUpload).post(postUpload);

export default videoRouter;
