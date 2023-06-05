import express from "express";
import { see, edit, upload, deleteVideo } from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("upload", upload); //파라미터보다 항상 위에 위치할 것 (아니라면 id 파라미터로 인식)
videoRouter.get("/:id(\\d+)", see); //id 파라미터 요청 (\\d+) -> 숫자만 정규표현식
videoRouter.get("/:id(\\d+)/edit", edit);
videoRouter.get("/:id(\\d+)/delete", deleteVideo);

export default videoRouter;
