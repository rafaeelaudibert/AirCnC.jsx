// Library imports
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const socketio = require("socket.io");
const http = require("http");

// First-party imports
const routes = require("./routes");

// Dotenv configuration
require("dotenv").config();

// App configuration
const app = express();
const server = http.Server(app);

const connectedUsers = {};

// MongoDB configuration
const connection_string = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@aircnc-a0d5i.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`;
mongoose.connect(connection_string, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Build WebSocket
const io = socketio(server);
io.on("connection", socket => {
  const { user_id } = socket.handshake.query;

  connectedUsers[user_id] = socket.id;
});

app.use((req, _res, next) => {
  req.io = io;
  req.connectedUsers = connectedUsers;

  return next();
});

app.use(cors());
app.use(express.json());
app.use("/files", express.static(path.resolve(__dirname, "..", "uploads")));
app.use(routes);

server.listen(3333);
