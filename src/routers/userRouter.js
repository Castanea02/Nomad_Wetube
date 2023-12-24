import express from "express";
import {
  edit,
  logout,
  see,
  postEdit,
  getEdit,
  startGithubLogin,
  finishGithubLogin,
  getChangePassword,
  postChangePassword,
} from "../controllers/userController";
import { protectorMiddleware, avatarUpload } from "../middlewares";
import { publicOnlyMiddleware } from "./../middlewares";

const userRouter = express.Router();

userRouter.get("/logout", protectorMiddleware, logout);

userRouter
  .route("/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(avatarUpload.single("avatar"), postEdit); //유저 접근제어 Middle ware

userRouter
  .route("/change-password")
  .all(protectorMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);

userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.get("/:id", see);

export default userRouter;
