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
    const id = socket.handshake.query.id;
    socket.join(id);

    socket.on("send-message", ({ recipients, text}) => {
      recipients.forEach(recipient => {
        // checking if sender is selected from list of recipients
        const newRecipients = recipients.filter(r !== recipient); 
        newRecipient.push(id);
        socket.broadcast.to(recipient).emit('receive-message', {
          recipients: newRecipients, sender: id, text
        })
      })
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});


// GO FOR WHATSAPP CLONE WEB DEV