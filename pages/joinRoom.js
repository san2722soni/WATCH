import React, { useEffect, useRef, useState } from "react";
import { BsArrowRight } from "react-icons/bs";
import { io } from "socket.io-client";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import { useSession } from "next-auth/react";

const JoinRoom = () => {
	const router = useRouter();
	const roomIDRef = useRef();
	const socketRef = useRef(null);

	const { data: session } = useSession();

	const handleCreateRoom = async () => {
		const res = await fetch("http://localhost:3000/api/fetchUser", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email: session.user.email }),
		});

		if (res.ok) {
			const user = await res.json();
			if (user.currentRoom == null) {
				const socket = io("http://localhost:8080");
				socket.on("connect", () => {
					const newID = socket.id;
					router.push(`/room?id=${newID}`);
				});
			}
		}
	};

	// Function to join an existing room
	const handleJoinRoom = async () => {
		const roomID = roomIDRef.current.value;
		const res = await fetch("http://localhost:3000/api/fetchUser", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email: session.user.email }),
		});

		if (res.ok) {
			const user = await res.json();
			console.log(user.currentRoom);
			if (user.currentRoom == null) {
				socketRef.current = io("http://localhost:8080");
				// Emit the "join-room" event to join an existing room
				console.log(socketRef.current.id);
				socketRef.current.emit(
					"join-room",
					roomID,
					session.user.email,
					(response) => {
						if (response.success) {
							router.push(`/room?id=${roomID}`);
						}
					}
				);
			}
		}
	};

	return (
		<div className="flex flex-col items-center gap-8">
			<button
				onClick={handleCreateRoom}
				className="flex items-center gap-2 rounded-lg bg-red-50 px-3.5 py-3.5 text-red-600 outline-none duration-150 hover:bg-red-100 focus:ring-2 focus:ring-red-700 active:bg-red-200"
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
						// className="w-64 rounded-md p-3 outline-none transition-colors duration-200 ease-in-out focus:border-red-500 focus:ring-2 focus:ring-red-200"
						className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base leading-8 text-gray-700 outline-none transition duration-200 ease-in-out focus:ring-2 focus:ring-red-600"
						placeholder="Enter RoomID"
					/>
					<button
						onClick={handleJoinRoom}
						className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-white outline-none transition duration-150 hover:bg-red-700 focus:ring-2 focus:ring-white active:shadow-lg"
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
