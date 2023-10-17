const express = require("express");
const cors = require("cors");
const { intrument, instrument } = require("@socket.io/admin-ui");
const { default: mongoose } = require("mongoose");
const User = require("../models/User");
const app = express();
require("dotenv").config();
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

let currentVideoState = {
	isPlaying: false,
	speed: 1,
	url: "",
	progress: 0,
};

io.on("connection", (socket) => {
	const { roomID, email } = socket.handshake.query;
	socket.on("join-room", async (roomID, email, callback) => {
		try {
			await mongoose.connect(process.env.MONGO_URI);

			if (io.sockets.adapter.rooms.has(roomID)) {
				socket.join(roomID);
				await User.findOneAndUpdate(
					{ email },
					{ $set: { currentRoom: roomID } }
				);
				socket.to(roomID).emit("user-joined", roomID, email, socket.id);
				console.log(`Socket ${socket.id} joined room ${roomID}`);
				callback({ success: true });
			} else {
				callback({ success: false });
			}
		} catch (error) {
			console.error(error);
			callback({ success: false });
		}
	});

	socket.on("member-change", (roomID, email) => {
		socket.to(roomID).emit("member-change", roomID, email);
	});

	socket.on("play-video", (roomID) => {
		socket.to(roomID).emit("play-video", roomID);
	});
	socket.on("pause-video", (roomID) => {
		socket.to(roomID).emit("pause-video");
	});

	socket.on("update-url", (roomID, url) => {
		socket.to(roomID).emit("update-url", roomID, url);
	});

	socket.on("update-progress", (roomID, progress) => {
		socket.to(roomID).emit("update-progress", roomID, progress);
	});

	socket.on("user-joined", async (roomID, email, socketID) => {
		await mongoose.connect(process.env.MONGO_URI);
		await User.findOneAndUpdate(
			{ email },
			{ $set: { currentRoom: roomID } }
		);
		socket.to(roomID).emit("user-joined", roomID, email, socketID);
	});

	socket.on("update-video-details", (roomID, socketID, videoDetails) => {
		console.log(videoDetails);
		io.to(socketID).emit(
			"update-video-details",
			roomID,
			socketID,
			videoDetails
		);
	});

	socket.on("user-left", async (roomID, email) => {
		await mongoose.connect(process.env.MONGO_URI);
		await User.findOneAndUpdate({ email }, { currentRoom: null });
		socket.to(roomID).emit("user-left", roomID, email);
	});

	socket.on("new-message", (roomID, email, msgObject) => {
		socket.to(roomID).emit("new-message", roomID, email, msgObject);
	});

	socket.on("update-video-details", (roomID, socketID) => {
		console.log("Hello");
		socket.to(socketID).emit("private");
	});

	socket.on("disconnect", async () => {
		const { roomID, email } = socket.handshake.query;
		await mongoose.connect(process.env.MONGO_URI);
		await User.findOneAndUpdate({ email }, { currentRoom: null });
		console.log("Disconnected from server side clog");
		socket.to(roomID).emit("user-left", roomID, email);
	});
});

instrument(io, { auth: false });

app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});
