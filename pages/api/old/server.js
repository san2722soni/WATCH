
const handler = async (req, res) => {
    res.json("working....");
    const io = require("socket.io")(5000, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"],
            addTrailingSlash: false
        }
    });
    
    io.on("connection", socket => {
        console.log("SOCKET IDS", socket.id);
    });  

}

export default handler;