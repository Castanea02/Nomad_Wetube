import express from "express"; //use Express
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const PORT = 4000;
const app = express();
app.set("view engine", "pug"); //Use Pug
app.set("views", process.cwd() + "/src/views"); //Pug 작동 디렉토리 설정
app.set("x-powered-by", false);
app.use(morgan("dev")); //Use Morgan
app.use(express.urlencoded({ extended: true })); //express Post 사용

app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

//======================================================= Start Server
const handleListening = () => {
  //Server Callback
  console.log(`Server Listening on port ${PORT} 🔥`);
};

app.listen(PORT, handleListening); //Server Listening
