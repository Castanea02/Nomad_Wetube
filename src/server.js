import express from "express"; //use Express
const PORT = 4000;
const app = express();

//requset, response Arugument
const handleHome = (req, res) => {
  //GET root callback
  return res.send("<h1>123</h1>"); //Home Response
};

const handleLogin = (req, res) => {
  return res.send("Login"); //Login Response
};

app.get("/", handleHome); //home(root) Request handleHome으로 처리
app.get("/login", handleLogin); //Login Request handleLogin으로 처리

const handleListening = () => {
  //Server Callback
  console.log(`Server Listening on port ${PORT} 🔥`);
};

app.listen(PORT, handleListening); //Server Listening
