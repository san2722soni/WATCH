import React, {
	useState,
	useRef,
	useEffect,
	useContext,
	Fragment,
} from "react";

import { Poppins } from "next/font/google";
import { Rubik } from "next/font/google";
import {
	BsFillPlayFill,
	BsPauseFill,
	BsFullscreen,
	BsFullscreenExit,
	BsVolumeUpFill,
	BsVolumeMuteFill,
	BsVolumeDownFill,
	BsPlayCircle,
	BsArrowLeft,
	BsCheck2,
	BsLink45Deg,
	BsSendPlus,
	BsFillCaretRightFill,
	BsPersonFillExclamation,
	BsShareFill,
} from "react-icons/bs";
import { IoCopySharp } from "react-icons/io5";
import { MdSettings } from "react-icons/md";
import { TbDoorExit } from "react-icons/tb";
import { RxCross1 } from "react-icons/rx";
import ReactPlayer from "react-player";
import { Popover, Transition, Tab, Dialog } from "@headlessui/react";
import { playerContext } from "./context/playerContext";
import debounce from "lodash.debounce";
import { io } from "socket.io-client";

import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { createAvatar } from "@dicebear/core";
import { identicon } from "@dicebear/collection";
import Link from "next/link";

import moment from "moment";
import Image from "next/image";
import { UserContext } from "./context/userContext";
import CopyToClipboardButton from "./components/copyToClipboardButton";
moment().format();

const poppins = Poppins({
	weight: ["500", "600", "700", "800"],
	subsets: ["latin"],
	display: "swap",
});

const rubik = Rubik({
	weight: ["300", "400", "500", "800", "900"],
	subsets: ["latin"],
	display: "swap",
});

const Room = () => {
	const {
		hasWindow,
		setHasWindow,
		isPlayerReady,
		setIsPlayerReady,
		play,
		setPlay,
		isFullScreen,
		setIsFullScreen,
		volume,
		setVolume,
		url,
		setUrl,
		isDropdownOpen,
		setIsDropdownOpen,
		speed,
		setSpeed,
		playtime,
		setPlaytime,
		setActiveMenu,
		fileUrl,
		setFileUrl,
	} = useContext(playerContext);

	const [showControls, setShowControls] = useState(true);
	const [isMouseVisible, setIsMouseVisible] = useState(true);
	const [isRoomConnected, setIsRoomConnected] = useState(false);
	const [members, setMembers] = useState([]);
	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState("");
	const [avatars, setAvatars] = useState({});
	const [openParticipantsModal, setOpenParticipantsModal] = useState(false);
	const { user, setUser } = useContext(UserContext);
	const [loading, setLoading] = useState(true);
	const [openShareModal, setOpenShareModal] = useState(false);

	const timerRef = useRef(null);

	const playerRef = useRef();
	const rangeInputRef = useRef();
	const vidSectionRef = useRef();
	const fullScreenBtnRef = useRef();
	const volumeInputRef = useRef();
	const urlInputRef = useRef();
	const socket = useRef(null);
	const urlSubmitRef = useRef();

	const controlsDeactivationTime = 3000;
	const router = useRouter();

	const { data: session } = useSession();

	const handlePlayerReady = () => {
		if (playerRef.current) {
			setIsPlayerReady(true);
		}
	};

	const handleRangeChange = (e) => {
		playerRef.current.seekTo(e.target.value, "seconds");
		setPlaytime(e.target.value);
		socket.current.emit("update-progress", roomID, e.target.value);
	};

	const handleProgressChange = () => {
		// get the current time of video
		// update the value of range input to current time of video
		if (rangeInputRef.current) {
			rangeInputRef.current.value = playerRef.current.getCurrentTime();

			if (
				playerRef.current.getDuration() ===
				playerRef.current.getCurrentTime()
			) {
				setPlay(false);
			}
		}
		setPlaytime(playerRef.current.getCurrentTime());
	};

	const handleOnPlay = () => {
		setPlay(true);
		socket.current.emit("play-video", roomID);
	};

	const handleOnPause = () => {
		setPlay(false);
		socket.current.emit("pause-video", roomID);
		socket.current.emit("update-progress", roomID, playtime);
	};

	const handleFullScreen = (e) => {
		if (isFullScreen) {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			}
		} else {
			if (vidSectionRef.current.requestFullscreen) {
				vidSectionRef.current.requestFullscreen();
				document.activeElement.blur(); // remove focus from the fullscreen button
			}
		}
	};

	const toggleFullscreen = () => {
		if (vidSectionRef.current) {
			if (!(document.fullscreenElement === vidSectionRef.current)) {
				vidSectionRef.current.requestFullscreen();
			} else {
				if (document.exitFullscreen) {
					document.exitFullscreen();
				}
			}
			setIsFullScreen(!isFullScreen);
		}
	};
	const togglePlayState = () => {
		setPlay((prevPlay) => !prevPlay);
		document.activeElement.blur();
	};

	const handleVolumeChange = (e) => {
		setVolume(parseFloat(e.target.value));
	};

	const handleMouseMove = () => {
		clearTimeout(timerRef.current);
		setShowControls(true);
		setIsMouseVisible(true);

		timerRef.current = setTimeout(() => {
			setShowControls(false);
			setIsDropdownOpen(false);
			setIsMouseVisible(false);
		}, controlsDeactivationTime); // Adjust the timeout value according to your preference (in milliseconds)
	};

	const formatTime = (seconds) => {
		const date = new Date(null);
		date.setSeconds(seconds);
		if (date instanceof Date && !isNaN(date)) {
			// Checking for a valid date object.
			if (seconds > 3600) {
				return date.toISOString().slice(-13, -5);
			} else {
				return date.toISOString().slice(-10, -5);
			}
		}
	};

	const fetchMembers = async () => {
		const res = await fetch("http://localhost:3000/api/fetchMembers", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ roomID: roomID }),
		});
		const newMembers = await res.json();
		const newAvatars = {};
		for (const member of newMembers) {
			newAvatars[member.email] = createAvatar(identicon, {
				size: 32,
				seed: member.profilePic.randomSeed,
			}).toDataUriSync();
		}

		setAvatars(newAvatars);
		setMembers(newMembers);
	};

	const roomID = router.query.id;

	useEffect(() => {
		if (typeof window !== "undefined") {
			setHasWindow(true);
		}

		const handleFullScreenChange = () => {
			setIsFullScreen(
				document.fullscreenElement === vidSectionRef.current
			);
		};

		// using debounce to prevent this from firing a lot of times if the arrow keys are pressed rapidly.
		const handleKeyPress = debounce((event) => {
			const activeElement = document.activeElement;
			const excludedTags = ["INPUT", "TEXTAREA", "SELECT"];
			if (
				excludedTags.includes(activeElement.tagName) &&
				!(activeElement.type === "range")
			) {
				return;
			}

			switch (event.key) {
				case "f":
					toggleFullscreen();
					break;
				case " ":
					event.preventDefault();
					togglePlayState();
					handleMouseMove();
					break;

				default:
					break;
			}
		}, 250);

		document.addEventListener("keydown", handleKeyPress);

		document.addEventListener("fullscreenchange", handleFullScreenChange);

		let syncInterval;
		if (isRoomConnected && playerRef.current) {
			syncInterval = setInterval(() => {
				const currentTime = playerRef.current.getCurrentTime();
				socket.current.emit("update-progress", currentTime);
			}, 5000);
		}

		// Cleanup
		return () => {
			if (socket.current && session) {
				socket.current.emit("user-left", roomID, session.user.email);
				socket.current.disconnect();
			}
			document.removeEventListener(
				"fullscreenchange",
				handleFullScreenChange
			);
			document.removeEventListener("keydown", handleKeyPress);
			handleKeyPress.cancel();
			clearInterval(syncInterval);
			setUrl("");
		};
	}, []);

	useEffect(() => {
		if (vidSectionRef.current) {
			vidSectionRef.current.addEventListener(
				"mousemove",
				handleMouseMove
			);
		}

		return () => {
			if (vidSectionRef.current) {
				vidSectionRef.current.removeEventListener(
					"mousemove",
					handleMouseMove
				);
			}
			clearTimeout(timerRef.current);
		};
	}, [vidSectionRef.current]);

	useEffect(() => {
		if (roomID && session) {
			// Use the socket ID to join the room
			// You can establish the socket connection here and join the room
			socket.current = io("http://localhost:8080", {
				query: { roomID: roomID, email: session.user.email },
			});
			// Join a room using the socket ID
			socket.current.on("connect", () => {
				session &&
					socket.current.emit(
						"join-room",
						roomID,
						session.user.email,
						(response) => {
							if (response.success) {
								setIsRoomConnected(true);
								fetchMembers();
								setLoading(false);
							} else {
								socket.current.disconnect();
								setLoading(false);
							}
						}
					);
			});

			socket.current.on("update-url", (roomID, url) => {
				setUrl(url);
			});

			socket.current.on("play-video", (roomID) => {
				setPlay(true);
			});
			socket.current.on("pause-video", (roomID) => {
				setPlay(false);
			});

			socket.current.on("update-progress", (roomID, progress) => {
				setPlaytime(Math.round(progress));
				if (playerRef.current) {
					playerRef.current.seekTo(progress, "seconds");
				}
			});

			socket.current.on("update-playback-speed", (roomID, newSpeed) => {
				setSpeed(newSpeed);
			});

			socket.current.on("user-joined", (roomID, email, socketID) => {
				const currentUrl = playerRef.current.props.url;
				const isPlaying = playerRef.current.props.playing;
				const currentTime = playerRef.current.getCurrentTime();
				const playbackRate = speed;
				const videoDetails = {
					currentUrl,
					isPlaying,
					currentTime,
					playbackRate,
				};
				console.log(videoDetails);
				socket.current.emit(
					"update-video-details",
					roomID,
					socketID,
					videoDetails
				);
				fetchMembers();
			});

			socket.current.on(
				"update-video-details",
				(roomID, socketID, videoDetails) => {
					console.log("This is updating video details.");
					setUrl(videoDetails.currentUrl);
					setPlay(videoDetails.isPlaying);
					setPlaytime(videoDetails.currentTime);
					setSpeed(videoDetails.playbackRate);
				}
			);

			socket.current.on("user-left", (roomID, email) => {
				fetchMembers();
			});

			socket.current.on("new-message", (roomID, email, msgObject) => {
				setMessages((prevMessages) => [...prevMessages, msgObject]);
			});

			return () => {
				socket.current.off("new-message");
			};
		}
	}, []);

	useEffect(() => {
		if (isPlayerReady && playerRef.current && playtime !== null) {
			playerRef.current.seekTo(playtime, "seconds");
		}
	}, [isPlayerReady]);

	useEffect(() => {
		if (socket.current) {
			socket.current.emit("update-playback-speed", roomID, speed);
		}
	}, [speed]);

	const handleSubmit = () => {
		setUrl(urlInputRef.current.value);
		setFileUrl("");
		socket.current.emit("update-url", roomID, urlInputRef.current.value);
		urlSubmitRef.current.classList.add("animate-btn");
		setTimeout(() => {
			urlSubmitRef.current.classList.remove("animate-btn");
		}, 500);
	};

	const handleChatSubmit = (e) => {
		e.preventDefault();
		if (newMessage.trim() !== "") {
			socket.current.emit("new-message", roomID, session.user.email, {
				user: {
					name: session.user.name,
					email: session.user.email,
					randomSeed: user.profilePic.randomSeed,
				},
				message: newMessage,
				time: moment().calendar(),
			});

			setMessages((prevMessages) => [
				...prevMessages,
				{
					user: {
						name: session.user.name,
						email: session.user.email,
						randomSeed: user.profilePic.randomSeed,
					},
					message: newMessage,
					time: moment().calendar(),
				},
			]);

			setNewMessage("");
			textareaRef.current.style.height = "auto";
		}
	};

	const textareaRef = useRef();
	const autoResize = () => {
		textareaRef.current.style.height = "auto";
		textareaRef.current.style.height =
			textareaRef.current.scrollHeight + "px";
	};

	return (
		<main>
			{isRoomConnected && (
				<div className="mt-2 flex h-full w-full flex-col gap-6 md:flex-row ">
					{/* Section 1: Video */}
					<div
						className={`flex w-full flex-col gap-2 px-2 py-2 md:w-2/3 ${
							isFullScreen
								? isMouseVisible
									? ""
									: "cursor-none"
								: ""
						}`}
					>
						<div className="flex gap-2">
							<input
								ref={urlInputRef}
								type="text"
								className="w-full rounded-md border border-gray-400 bg-gray-100 px-3 py-2 font-light text-black outline-none transition duration-200 ease-in-out placeholder:font-light focus:ring-2 focus:ring-red-600"
								placeholder="Enter Video URL here."
							/>
							<button
								onClick={handleSubmit}
								className="flex h-10 w-10 items-center justify-center rounded-md bg-red-600 text-white outline-none transition duration-150 focus:ring-2 focus:ring-white active:shadow-lg"
							>
								<span ref={urlSubmitRef}>
									<BsFillCaretRightFill className="text-lg" />
								</span>
							</button>
						</div>
						<section
							ref={vidSectionRef}
							className="relative flex max-h-[30rem] w-full select-none flex-col gap-3"
						>
							{hasWindow && (
								<>
									{url && (
										<ReactPlayer
											ref={playerRef}
											url={url}
											onReady={handlePlayerReady}
											config={{
												youtube: {
													playerVars: {
														disablekb: 1,
													},
												},
											}}
											className="pointer-events-none aspect-video"
											width="100%"
											height="100%"
											playing={play}
											onProgress={handleProgressChange}
											onPlay={handleOnPlay}
											onPause={handleOnPause}
											volume={volume}
											playbackRate={speed}
										/>
									)}
									{fileUrl && (
										<ReactPlayer
											ref={playerRef}
											url={fileUrl}
											onReady={handlePlayerReady}
											className="pointer-events-none aspect-video"
											width="100%"
											height="100%"
											playing={play}
											onProgress={handleProgressChange}
											onPlay={() => setPlay(true)}
											onPause={() => setPlay(false)}
											volume={volume}
											playbackRate={speed}
											config={{
												file: {
													attributes: {
														controls: false,
													},
												},
											}}
										/>
									)}
								</>
							)}
							{/* Controls */}
							{isPlayerReady &&
								ReactPlayer.canPlay(url) |
									ReactPlayer.canPlay(fileUrl) &&
								playerRef.current && (
									<div
										className={`${
											showControls && "opacity-100"
										} absolute bottom-0 flex w-full flex-col items-center gap-3 bg-gradient-to-t from-black via-black/70 to-transparent px-3 py-1 opacity-0 transition-opacity duration-300 md:px-5 md:py-2`}
									>
										<input
											className="range-input w-full accent-red-600"
											type="range"
											min={0}
											max={playerRef.current.getDuration()}
											onChange={handleRangeChange}
											ref={rangeInputRef}
										/>
										<div className="flex w-full items-center gap-3">
											<button
												onClick={() => setPlay(!play)}
											>
												{play ? (
													<BsPauseFill className="text-3xl text-white" />
												) : (
													<BsFillPlayFill className="text-3xl text-white" />
												)}
											</button>
											<button className="hidden md:block">
												{volume > 0.5 ? (
													<BsVolumeUpFill className="text-3xl text-white" />
												) : volume > 0 ? (
													<BsVolumeDownFill className="text-3xl text-white" />
												) : (
													<BsVolumeMuteFill className="text-3xl text-white" />
												)}
											</button>
											<input
												className="volume-input hidden w-1/5 accent-red-600 md:block"
												type="range"
												min={0}
												max={1}
												step={"0.01"}
												ref={volumeInputRef}
												onChange={handleVolumeChange}
											/>
											<span
												className={`${poppins.className} mr-auto text-sm text-white`}
											>
												{formatTime(playtime)} /{" "}
												{formatTime(
													playerRef.current.getDuration()
												)}
											</span>
											<div className="absolute bottom-10 right-5">
												<DropdownMenu />
											</div>
											<button
												onClick={() => {
													setIsDropdownOpen(
														(prevState) =>
															!prevState
													);
													setActiveMenu("main");
												}}
											>
												<MdSettings className="text-2xl text-white" />
											</button>
											<button
												ref={fullScreenBtnRef}
												onClick={handleFullScreen}
												// className="ml-auto"
											>
												{isFullScreen ? (
													<BsFullscreenExit className="text-xl text-white" />
												) : (
													<BsFullscreen className=" text-xl text-white" />
												)}
											</button>
										</div>
									</div>
								)}
						</section>
					</div>
					{/* Section 2: Chat */}

					<div className="relative flex h-[calc(100vh-6.5rem)] w-full flex-col gap-2 overflow-hidden rounded-t-md bg-gray-200 md:w-1/3">
						<button
							onClick={() => setOpenShareModal(true)}
							className="absolute left-2 top-2 max-w-fit rounded-full bg-black p-3 outline-none transition duration-200 focus:ring-4 focus:ring-neutral-400"
						>
							<BsShareFill className="text-lg text-white" />
						</button>
						<Transition appear show={openShareModal} as={Fragment}>
							<Dialog
								as="div"
								className="relative z-10 max-h-96 overflow-y-auto overflow-x-hidden"
								onClose={() => {
									setOpenShareModal(false);
								}}
							>
								<Transition.Child
									as={Fragment}
									enter="ease-out duration-300"
									enterFrom="opacity-0"
									enterTo="opacity-100"
									leave="ease-in duration-200"
									leaveFrom="opacity-100"
									leaveTo="opacity-0"
								>
									<div className="fixed inset-0 bg-black bg-opacity-25" />
								</Transition.Child>

								<div className="fixed inset-0 overflow-y-auto">
									<div className="flex min-h-full items-center justify-center p-4 text-center">
										<Transition.Child
											as={Fragment}
											enter="ease-out duration-300"
											enterFrom="opacity-0 scale-95"
											enterTo="opacity-100 scale-100"
											leave="ease-in duration-200"
											leaveFrom="opacity-100 scale-100"
											leaveTo="opacity-0 scale-95"
										>
											<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
												<Dialog.Title
													as="h3"
													className="border-b border-neutral-500 bg-gray-50 py-4 text-center text-lg font-medium leading-6 text-gray-900"
												>
													Share
												</Dialog.Title>
												<button
													onClick={() =>
														setOpenShareModal(false)
													}
													className="absolute right-4 top-3 rounded-md p-2 outline-none hover:bg-neutral-300 focus:bg-neutral-300 active:bg-neutral-200"
												>
													<RxCross1 />
												</button>
												<div className="flex flex-col gap-4 p-3">
													<div className="flex items-center justify-between rounded-md bg-gray-100 px-2">
														<input
															readOnly
															className="bg-transparent p-2 text-black outline-none"
															type="text"
															value={roomID}
														/>
														<CopyToClipboardButton
															onClick={() =>
																navigator.clipboard.writeText(
																	roomID
																)
															}
														/>
													</div>
													<div className="px-4">
														<h4 className="text-center text-xl">
															Steps to join
														</h4>
														<ol
															start={1}
															type="1"
															className="list-decimal"
														>
															<li>
																Go{" "}
																<Link
																	className="text-red-500 hover:underline"
																	href={
																		"/joinRoom"
																	}
																>
																	here.
																</Link>
															</li>
															<li>
																Enter the copied
																code and click
																on{" "}
																<span className="text-red-500">
																	Join
																</span>
																.
															</li>
														</ol>
													</div>
												</div>
											</Dialog.Panel>
										</Transition.Child>
									</div>
								</div>
							</Dialog>
						</Transition>
						<h3 className="border-b-2 border-b-neutral-400 py-4 text-center text-xl font-bold">
							Chat
						</h3>

						<button
							onClick={() => {
								const confirmLeave = window.confirm(
									"Are you sure you want to leave?"
								);
								if (confirmLeave) {
									router.push("/joinRoom");
								}
							}}
							className="absolute right-16 top-2 max-w-fit rounded-full bg-black p-3 focus:ring-4 focus:ring-neutral-400 focus:ring-offset-0"
						>
							<TbDoorExit className="text-xl text-white" />
						</button>

						<button
							onClick={() => setOpenParticipantsModal(true)}
							className="absolute right-2 top-2 max-w-fit rounded-full bg-black p-3 transition duration-200 focus:ring-4 focus:ring-neutral-400 focus:ring-offset-0"
						>
							<BsPersonFillExclamation className="text-xl text-white" />
						</button>

						<Transition
							appear
							show={openParticipantsModal}
							as={Fragment}
						>
							<Dialog
								as="div"
								className="relative z-10 max-h-96 overflow-y-auto overflow-x-hidden"
								onClose={() => setOpenParticipantsModal(false)}
							>
								<Transition.Child
									as={Fragment}
									enter="ease-out duration-300"
									enterFrom="opacity-0"
									enterTo="opacity-100"
									leave="ease-in duration-200"
									leaveFrom="opacity-100"
									leaveTo="opacity-0"
								>
									<div className="fixed inset-0 bg-black bg-opacity-25" />
								</Transition.Child>

								<div className="fixed inset-0 overflow-y-auto">
									<div className="flex min-h-full items-center justify-center p-4 text-center">
										<Transition.Child
											as={Fragment}
											enter="ease-out duration-300"
											enterFrom="opacity-0 scale-95"
											enterTo="opacity-100 scale-100"
											leave="ease-in duration-200"
											leaveFrom="opacity-100 scale-100"
											leaveTo="opacity-0 scale-95"
										>
											<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
												<Dialog.Title
													as="h3"
													className="border-b border-neutral-500 bg-gray-50 py-4 text-center text-lg font-medium leading-6 text-gray-900"
												>
													View Members
												</Dialog.Title>
												<button
													onClick={() =>
														setOpenParticipantsModal(
															false
														)
													}
													className="absolute right-4 top-3 rounded-md p-2 outline-none hover:bg-neutral-300 focus:bg-neutral-300 active:bg-neutral-200"
												>
													<RxCross1 />
												</button>
												<div className="divide- mt-2 flex flex-col divide-y-2 p-4">
													{members &&
														members.map(
															(member, index) => {
																const userAvatar =
																	avatars[
																		member
																			.email
																	];
																return (
																	<div
																		key={
																			index
																		}
																		className="flex items-center gap-2 py-2"
																	>
																		<img
																			className="rounded-full bg-black"
																			src={
																				userAvatar
																			}
																			alt=""
																		/>
																		<span>
																			{
																				member.name
																			}
																		</span>
																	</div>
																);
															}
														)}
												</div>
											</Dialog.Panel>
										</Transition.Child>
									</div>
								</div>
							</Dialog>
						</Transition>
						<div className="flex h-full flex-grow flex-col gap-6 overflow-y-auto px-4 py-4 text-black">
							{messages &&
								messages.map((msgObj, index) => {
									const userAvatar =
										avatars[msgObj.user.email];
									const fallbackAvatar =
										"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100%' height='100%' fill='%23000000' /%3E%3C/svg%3E";
									return (
										<div
											key={index}
											className={`flex flex-col gap-2 ${
												msgObj.user.name ===
												session.user.name
													? ""
													: "items-end"
											}`}
										>
											<div className="flex items-center gap-2">
												<div className="h-10 w-10">
													<img
														src={
															userAvatar ||
															fallbackAvatar
														}
														className="h-full w-full rounded-full bg-black object-cover"
														alt=""
													/>
												</div>
												<span>{msgObj.user.name}</span>
											</div>
											<span className="text-sm">
												{msgObj.time}
											</span>
											<p
												className={`w-max max-w-xs whitespace-pre-line break-words rounded-t-md rounded-br-md p-3 text-sm text-white ${
													msgObj.user.name ===
													session.user.name
														? "bg-red-600"
														: "bg-neutral-600"
												}`}
											>
												{msgObj.message}
											</p>
										</div>
									);
								})}
						</div>
						<form
							onSubmit={handleChatSubmit}
							className="flex w-full items-center justify-center gap-3 px-4 pb-2"
						>
							<textarea
								ref={textareaRef}
								required
								// onChange={(e) => setTextareaValue(e.target.value)}
								onInput={autoResize}
								value={newMessage}
								onChange={(e) => {
									setNewMessage(e.target.value);
								}}
								placeholder="Enter Message"
								className="w-full resize-none rounded-md bg-gray-300 px-2 py-2 outline-none transition duration-150 ease-in-out placeholder:text-gray-500 focus:bg-black/10 focus:ring-2 focus:ring-black/60"
							></textarea>
							<button className="flex aspect-square w-10 items-center justify-center rounded-md bg-red-600 text-white outline-none transition duration-150 focus:ring-2 focus:ring-black active:shadow-lg">
								<BsSendPlus />
							</button>
						</form>
					</div>
				</div>
			)}
			{!isRoomConnected && !loading && (
				<div className="flex flex-col items-center justify-center">
					<div>
						<img
							className="h-full w-full select-none object-contain"
							src="/assets/page_not_found.svg"
						></img>
					</div>
					<h2 className="text-2xl text-white">
						This room does not exist. Go{" "}
						<Link
							className="text-red-500 hover:underline"
							href={"/joinRoom"}
						>
							here
						</Link>{" "}
						and enter a valid roomID to join.
					</h2>
				</div>
			)}
		</main>
	);
};

const DropdownMenu = () => {
	const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
	const { speed, setSpeed, isDropdownOpen, activeMenu, setActiveMenu, url } =
		useContext(playerContext);

	const [icon, setIcon] = useState(<BsLink45Deg />);
	const DropdownItem = (props) => {
		return (
			<button
				onClick={() => {
					props.goToMenu && setActiveMenu(props.goToMenu);
					props.onClickEvent && props.onClickEvent();
				}}
				className="flex w-44 items-center gap-2 p-3 text-white hover:bg-gray-700"
			>
				<span>{props.leftIcon}</span>
				<span>{props.name}</span>
			</button>
		);
	};

	return (
		<>
			<Transition
				show={isDropdownOpen}
				enter="transition-opacity duration-300"
				enterFrom="opacity-0"
				enterTo="opacity-1"
				leave="transition-opacity durarion-300"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<div className="max-h-52 overflow-y-auto bg-black/90">
					<Transition
						show={activeMenu !== "main"}
						enter="transition-all duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="transition-all duration-300"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						{activeMenu !== "main" && (
							<DropdownItem
								goToMenu="main"
								leftIcon={<BsArrowLeft />}
								name="Playback Speed"
							/>
						)}
					</Transition>
					<Transition
						show={activeMenu === "main"}
						enter="transition-all duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="transition-all duration-300"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<DropdownItem
							goToMenu="Playback Speed"
							leftIcon={<BsPlayCircle />}
							name="PlayBack Speed"
						/>
						{url && (
							<DropdownItem
								// goToMenu="Playback Speed"
								onClickEvent={() => {
									navigator.clipboard.writeText(url);
									setIcon(<BsCheck2 />);
									setTimeout(() => {
										setIcon(
											<BsLink45Deg className="text-lg" />
										);
									}, 1500);
								}}
								leftIcon={icon}
								name="Copy Video URL"
							/>
						)}
					</Transition>
					<Transition
						show={activeMenu === "Playback Speed"}
						enter="transition-all duration-500"
						enterFrom="opacity-0 -translate-x-3 h-0"
						enterTo="opacity-100 translate-x-0 h-auto"
						leave="transition-all duration-500"
						leaveFrom="opacity-100 translate-x-0 h-auto"
						leaveTo="opacity-0 -translate-x-3 h-0"
					>
						<div className="flex flex-col gap-2 overflow-hidden">
							{speeds.map((s, index) => {
								return (
									<DropdownItem
										onClickEvent={() => setSpeed(s)}
										name={s}
										key={index}
										leftIcon={
											s === speed ? <BsCheck2 /> : ""
										}
									/>
								);
							})}
						</div>
					</Transition>
				</div>
			</Transition>
		</>
	);
};

export default Room;
