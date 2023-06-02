import express from "express"; //use Express
const PORT = 4000;
const app = express();

const logger = (req, res, next) => {
  //middleware
  console.log(`${req.method}, ${req.url}`);
  next();
};
const privateMiddleware = (req, res, next) => {
  const url = req.url;
  if (url === "/protected") {
    return res.send("<h1>Not allowed</h1>");
  }
  console.log("Allow");
  next();
};

//requset, response Arugument
const handleHome = (req, res) => {
  //GET root callback
  return res.send("<h1>123</h1>"); //Home Response
};

const handleProtected = (req, res, next) => {
  return res.send("Private Check");
};

app.use(logger); //Use middleware All URL
app.use(privateMiddleware);

app.get("/", handleHome); //home(root) Request handleHome으로 처리
app.get("/protected", handleProtected);

const handleListening = () => {
  //Server Callback
  console.log(`Server Listening on port ${PORT} 🔥`);
};

app.listen(PORT, handleListening); //Server Listening
