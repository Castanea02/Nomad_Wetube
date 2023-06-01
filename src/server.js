import express from "express";

const app = express();

const PORT = 4000;

const handleListening = () => console.log("Server Listening on port 4000 🔥");

app.listen(PORT, handleListening);
