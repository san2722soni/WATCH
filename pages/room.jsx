import React, { useState, useRef, useEffect, useContext } from "react";

import {
	BsFillPlayFill,
	BsPauseFill,
	BsFullscreen,
	BsFullscreenExit,
	BsFillVolumeUpFill,
	BsFillVolumeMuteFill,
	BsPlayCircle,
	BsCheck2,
} from "react-icons/bs";
import { MdSettings } from "react-icons/md";

import { Poppins } from "next/font/google";
import { Rubik } from "next/font/google";

import ReactPlayer from "react-player";
import { Transition } from "@headlessui/react";
import { playerContext } from "./context/playerContext";

const poppins = Poppins({
	weight: ["400", "500", "600", "700", "800"],
	subsets: ["latin"],
	display: "swap",
});

const rubik = Rubik({
	weight: ["300", "500", "800", "900"],
	subsets: ["latin"],
	display: "swap",
});

const Room = () => {
	const player = useContext(playerContext);

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
	} = player;

	const playerRef = useRef();
	const rangeInputRef = useRef();
	const vidSectionRef = useRef();
	const fullScreenBtnRef = useRef();
	const volumeInputRef = useRef();

	const handlePlayerReady = () => {
		if (playerRef.current) {
			setIsPlayerReady(true);
		}
	};

	const handleVolumeChange = (e) => {
		setVolume(e.target.value);
	};

	const handleRangeChange = (e) => {
		playerRef.current.seekTo(e.target.value, "seconds");
	};

	const handleProgressChange = () => {
		// get the current time of video
		// update the value of range input to current time of video
		rangeInputRef.current.value = playerRef.current.getCurrentTime();
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
			// Check if a text input element is focused
			const isTextInputFocused =
				event.target.tagName === "INPUT" ||
				event.target.tagName === "TEXTAREA";

			// Ignore keyboard shortcuts if a text input element is focused
			if (isTextInputFocused) {
				return;
			}
			if (event.key === "f") {
				toggleFullscreen();
			}
			if (event.key === " ") {
				event.preventDefault();
				togglePlayState();
			}
		};

		document.addEventListener("keydown", handleKeyPress);

		document.addEventListener("fullscreenchange", handleFullScreenChange);

		// Cleanup
		return () => {
			document.removeEventListener(
				"fullscreenchange",
				handleFullScreenChange
			);
			document.removeEventListener("keydown", handleKeyPress);
		};
	}, []);

	return (
		<main className="mt-7 flex flex-col gap-16 px-10 md:flex-row">
			{/* Section 1: Video */}
			<section className="flex flex-col gap-3 md:w-3/5">
				<div className={`${poppins.className}`}>
					<label
						// for="website-url"
						className="block py-2 font-medium text-gray-300"
					>
						Video URL
					</label>
					<div className="flex items-center gap-4 text-gray-50">
						{/* <div className="rounded-l-md border-r bg-gray-600 px-3 py-2.5">
								https://
							</div> */}
						<input
							onChange={(e) => setUrl(e.target.value)}
							type="text"
							placeholder="www.example.com"
							id="website-url"
							className="w-full rounded-md border border-gray-400 bg-transparent p-2.5 outline-none placeholder:text-sm placeholder:font-light"
						/>
					</div>
				</div>
				<section
					ref={vidSectionRef}
					className="relative mb-5 flex w-full flex-col gap-4 md:w-full"
				>
					{hasWindow && (
						<ReactPlayer
							ref={playerRef}
							url={url}
							onReady={handlePlayerReady}
							config={{
								youtube: {
									playerVars: {
										disablekb: 1,
										quality: "hd1080",
									},
								},
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
					{isPlayerReady && ReactPlayer.canPlay(url) && (
						<div
							className={`flex flex-col gap-3 ${
								isFullScreen && "px-5 py-2"
							}`}
						>
							<input
								className="range-input w-full transition-all"
								type="range"
								min={0}
								max={playerRef.current.getDuration()}
								onChange={handleRangeChange}
								ref={rangeInputRef}
							/>
							<div className="flex items-center gap-3">
								<button onClick={() => setPlay(!play)}>
									{play ? (
										<BsPauseFill className="text-3xl text-white" />
									) : (
										<BsFillPlayFill className="text-3xl text-white" />
									)}
								</button>
								<div className="flex w-full items-center gap-1">
									<button>
										{volume > 0 ? (
											<BsFillVolumeUpFill className="text-3xl text-white" />
										) : (
											<BsFillVolumeMuteFill className="text-3xl text-white" />
										)}
									</button>
									<input
										className="range-input w-1/2 md:w-1/4"
										type="range"
										min={0}
										max={1}
										onChange={handleVolumeChange}
										step={"0.01"}
										ref={volumeInputRef}
									/>
								</div>
								<button
									onClick={() =>
										setIsDropdownOpen(!isDropdownOpen)
									}
								>
									<MdSettings className="text-2xl text-white" />
								</button>
								<button
									ref={fullScreenBtnRef}
									onClick={handleFullScreen}
								>
									{isFullScreen ? (
										<BsFullscreenExit className="text-xl text-white" />
									) : (
										<BsFullscreen className=" text-xl text-white" />
									)}
								</button>
							</div>
							<div className="absolute bottom-10 right-5">
								{isDropdownOpen && <DropdownMenu />}
							</div>
						</div>
					)}
				</section>
			</section>
			{/* Section 2: Room Info */}
			<section className="flex flex-col gap-2 text-white">
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
				{/* Chat UI */}
				{/* <div className="flex w-72 flex-col gap-3 bg-black/20 p-4 text-black">
					<p className="max-w-max rounded-md bg-white p-1">Msg 1</p>
					<p className="max-w-max self-end rounded-md bg-white p-1">
						Msg 2
					</p>
					<p className="max-w-max rounded-md bg-white p-1">Msg 3</p>
				</div> */}
			</section>
		</main>
	);
};

const DropdownMenu = () => {
	const [activeMenu, setActiveMenu] = useState("main");

	const { speed, setSpeed } = useContext(playerContext);

	const speeds = [0.25, 0.5, 1, 1.25, 1.5, 1.75, 2];

	const DropdownItem = (props) => {
		return (
			<button
				onClick={() => {
					props.goToMenu && setActiveMenu(props.goToMenu);
					props.onClickEvent && props.onClickEvent();
				}}
				className="flex items-center gap-2 p-2 text-white hover:bg-white/30"
			>
				<span>{props.leftIcon}</span>
				{props.children}
			</button>
		);
	};

	return (
		<div className="dropdown h-36 w-52 overflow-y-auto overflow-x-hidden rounded-md bg-black/90 p-1">
			<Transition
				show={activeMenu === "main"}
				enter="transition ease-out duration-200 transform"
				enterFrom="opacity-0 translate-y-2"
				enterTo="opacity-100 translate-y-0"
				leave="transition ease-in duration-150 transform"
				leaveFrom="opacity-100 translate-y-0"
				leaveTo="opacity-0 translate-y-2"
			>
				<div className={`menu flex flex-col gap-3`}>
					<DropdownItem
						leftIcon={<BsPlayCircle />}
						goToMenu="Playback Speed"
					>
						Playback Speed
					</DropdownItem>
				</div>
			</Transition>
			<Transition
				show={activeMenu === "Playback Speed"}
				enter="transition ease-in duration-300 transform"
				enterFrom="opacity-0 -translate-x-3"
				enterTo="opacity-100 translate-x-0"
				leave="transition ease-out duration-300 transform"
				leaveFrom="opacity-100 translate-x-0"
				leaveTo="opacity-0 -translate-x-3"
			>
				<div className={`menu flex flex-col gap-3`}>
					{speeds.map((s) => {
						return (
							<DropdownItem
								leftIcon={s === speed ? <BsCheck2 /> : ""}
								onClickEvent={() => setSpeed(s)}
							>
								{s}
							</DropdownItem>
						);
					})}
				</div>
			</Transition>
		</div>
	);
};

export default Room;
