const express = require("express");
const cors = require("cors");
const app = express();

const io = require("socket.io")(8080, {
  cors: {
    origin: ["http://localhost:3000/room", "http://localhost:3000"],
    methods: ["GET", "POST"],
    allowHeaders: ["my-custom-header"],
    addTrailingSlash: false,
  },
});

const PORT = 5000;

app.use(cors());

app.get("/api/socket", (req, res) => {

  io.on("connection", (socket) => {
    console.log("SOCKET IDS", socket.id);

    socket.on("send-message", (message) => {
      console.log("Message:", message);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});


// GO FOR WHATSAPP CLONE WEB DEV