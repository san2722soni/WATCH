import { createContext, useState } from "react";

export const playerContext = createContext();

export const PlayerState = ({ children }) => {
	const [hasWindow, setHasWindow] = useState(false);
	const [isPlayerReady, setIsPlayerReady] = useState(false);
	const [play, setPlay] = useState(false);
	const [isFullScreen, setIsFullScreen] = useState(false);
	const [volume, setVolume] = useState(1);
	const [url, setUrl] = useState("");
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [speed, setSpeed] = useState(1);

	const player = {
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
	};

	return (
		<playerContext.Provider value={player}>
			{children}
		</playerContext.Provider>
	);
};
