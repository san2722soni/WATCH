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
} from "react-icons/bs";
import { MdSettings, MdKeyboardArrowDown } from "react-icons/md";
import ReactPlayer from "react-player";
import { Popover, Transition } from "@headlessui/react";
import { playerContext } from "./context/playerContext";

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

// TODO: Implement Cursor hide when showControls is false

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
	} = useContext(playerContext);

	const [showControls, setShowControls] = useState(true);
	const [isMouseVisible, setIsMouseVisible] = useState(true);
	const timerRef = useRef(null);

	const playerRef = useRef();
	const rangeInputRef = useRef();
	const vidSectionRef = useRef();
	const fullScreenBtnRef = useRef();
	const volumeInputRef = useRef();
	const controlsDeactivationTime = 3000;

	const handlePlayerReady = () => {
		if (playerRef.current) {
			setIsPlayerReady(true);
		}
	};

	const handleRangeChange = (e) => {
		playerRef.current.seekTo(e.target.value, "seconds");
		setPlaytime(e.target.value);
	};

	const handleProgressChange = () => {
		// get the current time of video
		// update the value of range input to current time of video
		rangeInputRef.current.value = Math.ceil(
			playerRef.current.getCurrentTime()
		);
		setPlaytime(Math.floor(playerRef.current.getCurrentTime()));
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
		// setShowControls(true);
	};

	const handleVolumeChange = (e) => {
		setVolume(parseFloat(e.target.value));
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

	useEffect(() => {
		if (typeof window !== "undefined") {
			setHasWindow(true);
		}

		const handleFullScreenChange = () => {
			setIsFullScreen(
				document.fullscreenElement === vidSectionRef.current
			);
		};
		const handleKeyPress = (event) => {
			const activeElement = document.activeElement;
			const excludedTags = ["INPUT", "TEXTAREA", "SELECT"];
			if (
				excludedTags.includes(activeElement.tagName) &&
				!(activeElement.type === "range")
			) {
				console.log(activeElement.type);
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

		if (vidSectionRef.current) {
			vidSectionRef.current.addEventListener(
				"mousemove",
				handleMouseMove
			);
		}
		document.addEventListener("keydown", handleKeyPress);

		document.addEventListener("fullscreenchange", handleFullScreenChange);

		// Cleanup
		return () => {
			document.removeEventListener(
				"fullscreenchange",
				handleFullScreenChange
			);
			document.removeEventListener("keydown", handleKeyPress);
			if (vidSectionRef.current) {
				vidSectionRef.current.removeEventListener(
					"mousemove",
					handleMouseMove
				);
			}
			clearTimeout(timerRef.current);
		};
	}, []);

	// TODO: Implement Cursor hide when showControls is false

	return (
		<main className="mb-5 mt-7 flex flex-col gap-6 px-10 md:flex-row">
			{/* Section 1: Video */}
			<div
				className={`flex w-full flex-col gap-2 md:w-2/3 ${
					isFullScreen ? (isMouseVisible ? "" : "cursor-none") : ""
				}`}
			>
				<label className="text-gray-300" htmlFor="video-url">
					Video URL
				</label>
				<input
					onChange={(e) => setUrl(e.target.value)}
					type="text"
					className="w-full rounded-md border border-gray-400 bg-transparent px-3 py-2 font-light text-white outline-none placeholder:font-light"
					placeholder="Enter Video URL here."
				/>
				<section
					ref={vidSectionRef}
					className="relative flex w-full flex-col gap-3"
				>
					{hasWindow && (
						<ReactPlayer
							ref={playerRef}
							url={url}
							onReady={handlePlayerReady}
							config={{
								youtube: { playerVars: { disablekb: 1 } },
							}}
							className="pointer-events-none aspect-video"
							width="100%"
							height="100%"
							playing={play}
							onProgress={handleProgressChange}
							onPlay={() => setPlay(true)}
							onPause={() => setPlay(false)}
							volume={volume}
							playbackRate={speed}
						/>
					)}
					{/* Controls */}
					{isPlayerReady &&
						ReactPlayer.canPlay(url) &&
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
									<button onClick={() => setPlay(!play)}>
										{play ? (
											<BsPauseFill className="text-3xl text-white" />
										) : (
											<BsFillPlayFill className="text-3xl text-white" />
										)}
									</button>
									<button>
										{volume > 0.5 ? (
											<BsVolumeUpFill className="text-3xl text-white" />
										) : volume > 0 ? (
											<BsVolumeDownFill className="text-3xl text-white" />
										) : (
											<BsVolumeMuteFill className="text-3xl text-white" />
										)}
									</button>
									<input
										className="volume-input w-1/5 accent-red-600 "
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
										<DropdowMenu />
									</div>
									<button
										onClick={() => {
											setIsDropdownOpen(
												(prevState) => !prevState
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
			{/* Section 2: Room Info */}
			{/* <section className="flex flex-col gap-2 text-white">
				<h3 className={`${poppins.className} font- text-2xl`}>
					Members
				</h3>
				<ol
					className={`flex flex-col gap-2 font-light ${rubik.className} list-inside list-decimal`}
				>
					<li>Nishil</li>
					<li>Nishil ki bandi (Future)</li>
					<li>Aswin</li>
					<li>Aswin ki bandi (Future)</li>
				</ol>
			</section> */}
			{/* Section 3: Chat Section */}
			<section
				className={`${poppins.className} relative flex min-h-[20rem] w-full flex-col rounded-md bg-white/30 text-center text-xl text-white md:w-1/3`}
			>
				<h3 className="border-b p-2">Chat Room</h3>
				<input
					type="text"
					className="mt-auto w-full bg-black/50 p-3 text-sm font-light outline-none placeholder:text-gray-300"
					placeholder="Type your message here."
				/>
				<div className="absolute -top-10 right-0">
					<MembersDropdown />
				</div>
			</section>
			{/* <p className="text-white">
				// TODO: Implement Cursor hide when showControls is false
			</p> */}
		</main>
	);
};

const DropdowMenu = () => {
	const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
	const { speed, setSpeed, isDropdownOpen, activeMenu, setActiveMenu } =
		useContext(playerContext);
	const DropdownItem = (props) => {
		return (
			<button
				onClick={() => {
					props.goToMenu && setActiveMenu(props.goToMenu);
					props.onClickEvent && props.onClickEvent();
				}}
				className="flex w-44 items-center gap-2 p-3 text-white hover:bg-gray-400"
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
						<div className="flex flex-col gap-2">
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

const MembersDropdown = (props) => {
	const { members, setMembers } = useContext(playerContext);
	return (
		<div>
			<Popover>
				<Popover.Button className="flex w-40 items-center justify-between gap-2 rounded-md border-none bg-neutral-700 px-2 py-1 text-white outline-none focus:ring-2 focus:ring-white">
					<span className="text-base">Members</span>
					<MdKeyboardArrowDown />
				</Popover.Button>
				<Transition
					enter="transition-opacity transition-transform duration-200 ease-out"
					enterFrom="opacity-0 translate-y-1"
					enterTo="opacity-100 translate-y-0"
					leave="transition-opacity transition-transform duration-200 ease-in"
					leaveFrom="opacity-100 translate-y-0"
					leaveTo="opacity-0 translate-y-1"
				>
					<Popover.Panel>
						<ol className="divide-y-2 divide-black/30 rounded-md bg-neutral-300">
							{members.map((member, index) => {
								return (
									<li
										key={index}
										className={` ${poppins.className} list-inside list-decimal p-2 text-left text-base text-black`}
									>
										{member}
									</li>
								);
							})}
						</ol>
					</Popover.Panel>
				</Transition>
			</Popover>
		</div>
	);
};

export default Room;
