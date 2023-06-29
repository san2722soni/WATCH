import React, { useState, useRef, useEffect } from "react";

import { Poppins } from "next/font/google";
import { Rubik } from "next/font/google";
import {
	BsFillPlayFill,
	BsPauseFill,
	BsFullscreen,
	BsFullscreenExit,
} from "react-icons/bs";
import ReactPlayer from "react-player";

const poppins = Poppins({
	weight: ["500", "600", "700", "800"],
	subsets: ["latin"],
	display: "swap",
});

const rubik = Rubik({
	weight: ["300", "500", "800", "900"],
	subsets: ["latin"],
	display: "swap",
});

const Room = () => {
	const [hasWindow, setHasWindow] = useState(false);
	const [isPlayerReady, setIsPlayerReady] = useState(false);

	const [play, setPlay] = useState(false);
	const [isFullScreen, setIsFullScreen] = useState(false);

	const [fullscreenRequested, setFullscreenRequested] = useState(false);

	const playerRef = useRef();
	const rangeInputRef = useRef();
	const vidSectionRef = useRef();
	const fullScreenBtnRef = useRef();

	const handlePlayerReady = () => {
		if (playerRef.current) {
			setIsPlayerReady(true);
		}
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
		<main className="mt-7 flex gap-16 px-10">
			{/* Section 1: Video */}
			<section ref={vidSectionRef} className="flex w-3/5 flex-col gap-3">
				{hasWindow && (
					<ReactPlayer
						ref={playerRef}
						url="https://youtu.be/Iqt3Ih18VDk"
						onReady={handlePlayerReady}
						config={{ youtube: { playerVars: { disablekb: 1 } } }}
						className="pointer-events-none aspect-video"
						width="100%"
						height="100%"
						playing={play}
						onProgress={handleProgressChange}
						onPlay={() => setPlay(true)}
						onPause={() => setPlay(false)}
					/>
				)}
				{/* Controls */}
				{isPlayerReady && (
					<div
						className={`flex items-center gap-3 ${
							isFullScreen && "px-5 py-2"
						}`}
					>
						<button onClick={() => setPlay(!play)}>
							{play ? (
								<BsPauseFill className="text-3xl text-white" />
							) : (
								<BsFillPlayFill className="text-3xl text-white" />
							)}
						</button>
						<input
							className="range-input w-full accent-red-600"
							type="range"
							min={0}
							max={playerRef.current.getDuration()}
							onChange={handleRangeChange}
							ref={rangeInputRef}
						/>
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
				)}
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
			</section>
		</main>
	);
};

export default Room;
