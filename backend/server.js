const express = require("express");
const cors = require("cors");
const { intrument, instrument } = require("@socket.io/admin-ui");
const app = express();

const io = require("socket.io")(8080, {
	cors: {
		origin: ["http://localhost:3000", "https://admin.socket.io/"],
		methods: ["GET", "POST"],
		allowHeaders: ["my-custom-header"],
		addTrailingSlash: false,
	},
});

const PORT = 5000;

app.use(cors());

io.on("connection", (socket) => {
	socket.on("send-message", (msg, room) => {
		socket.broadcast.emit("r-m", msg);
	});
	socket.on("join-room", (roomID, callback) => {
		try {
			if (io.sockets.adapter.rooms.has(roomID)) {
				socket.join(roomID);
				console.log(`Connected to roomID: ${roomID}`);
				callback({ success: true });
			} else {
				callback({ success: false });
			}
		} catch (error) {
			console.error("Failed to connect!");
			callback({ success: false });
		}
	});

	socket.on("create-room", (roomID, callback) => {
		if (io.sockets.adapter.rooms.has(roomID)) {
			console.log("Room already exists!");
			callback({ success: false });
		} else {
			console.log(`Created a room with ID: ${roomID}`, socket.id);
			socket.join(roomID);
			callback({ success: true });
		}
	});
});

instrument(io, { auth: false });

app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});
