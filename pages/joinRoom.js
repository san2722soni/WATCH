import React, { useRef } from "react";
import { BsArrowRight } from "react-icons/bs";
import { io } from "socket.io-client";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";

const JoinRoom = () => {
	const router = useRouter();
	const roomIDRef = useRef();
	const socketRef = useRef(null);

	socketRef.current = io("http://localhost:8080");
	const handleCreateRoom = () => {
		const newID = "123456789";
		console.log(newID);
		socketRef.current.emit("create-room", newID, (response) => {
			if (response.success) {
				router.push(`/room?id=${newID}`);
			} else {
				console.log("Failed");
			}
		});
	};

	// Function to join an existing room
	const handleJoinRoom = () => {
		const roomID = roomIDRef.current.value;

		// Emit the "joinRoom" event to join an existing room
		socketRef.current.emit("join-room", roomID, (response) => {
			if (response.success) {
				router.push(`/room?id=${roomID}`);
			}
		});
	};

	return (
		<div className="flex flex-col items-center gap-8">
			<button
				onClick={handleCreateRoom}
				className="flex items-center gap-2 rounded-lg bg-red-50 px-3.5 py-3.5 text-red-600 duration-150 hover:bg-red-100 active:bg-red-200"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					className="h-6 w-6"
				>
					<path
						fillRule="evenodd"
						d="M12 5.25a.75.75 0 01.75.75v5.25H18a.75.75 0 010 1.5h-5.25V18a.75.75 0 01-1.5 0v-5.25H6a.75.75 0 010-1.5h5.25V6a.75.75 0 01.75-.75z"
						clipRule="evenodd"
					/>
				</svg>
				<span>Create a new Room!</span>
			</button>
			<div>
				<p className="mb-2 text-lg text-white">
					Enter an existing roomID.
				</p>
				<div className="flex items-center gap-2">
					<input
						ref={roomIDRef}
						type="text"
						className="w-64 rounded-md p-3 outline-none transition duration-100 focus:ring-4 focus:ring-red-500/80"
						placeholder="Enter RoomID"
					/>
					<button
						onClick={handleJoinRoom}
						className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-white duration-150 hover:bg-red-700 active:shadow-lg"
					>
						Join
						<BsArrowRight className="h-5 w-5" />
					</button>
				</div>
			</div>
		</div>
	);
};

export default JoinRoom;
