const express = require('express');
const cors = require('cors');
const app = express();

const io = require("socket.io")(8080, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      addTrailingSlash: false
    }
  });

const PORT = 5000;

app.use(cors());

app.get('/api/home', (req, res)=>{
    res.json({message : "THIS IS WORKING!"});
});

app.listen(PORT, ()=>{
    console.log(`Server started on port ${PORT}`);
});

io.on("connection", socket => {
    console.log("SOCKET IDS",socket.id);
    socket.on("custom-event", (number, string, obj)=>{
        console.log(number, string, obj)
    });
});


// yarn run both