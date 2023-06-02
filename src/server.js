import express from "express"; //use Express
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const PORT = 4000;
const app = express();
app.use(morgan("dev")); //Use Morgan

app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

//======================================================= Start Server
const handleListening = () => {
  //Server Callback
  console.log(`Server Listening on port ${PORT} 🔥`);
};

app.listen(PORT, handleListening); //Server Listening
