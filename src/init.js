import "./db";
import "./models/Video";
import app from "./server";

const PORT = 4000;
//======================================================= Start Server
const handleListening = () => {
  //Server Callback
  console.log(`✅ Server Listening on port ${PORT}`);
};

app.listen(PORT, handleListening); //Server Listening
