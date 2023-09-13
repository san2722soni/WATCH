const express = require("express");
const cors = require("cors");
const { intrument, instrument } = require('@socket.io/admin-ui');
const app = express();

const io = require("socket.io")(8080, {
  cors: {
    origin: ["http://localhost:3000/room", "http://localhost:3000", "https://admin.socket.io/"],
    methods: ["GET", "POST"],
    allowHeaders: ["my-custom-header"],
    addTrailingSlash: false,
  },
});

const PORT = 5000;

app.use(cors());


  io.on("connection", (socket) => {
    socket.on("send-message", (msg, room) => {
        socket.broadcast.emit('r-m', msg);
    });
  });

  instrument(io, { auth: false })

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
