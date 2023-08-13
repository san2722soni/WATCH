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
	const [playtime, setPlaytime] = useState(0);
	const [activeMenu, setActiveMenu] = useState("main");
	const [members, setMembers] = useState([
		"Nishil",
		"Nishil ki bandi",
		"Aswin",
		"Aswin ki bandi",
	]);
	const [fileUrl, setFileUrl] = useState("");

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
		playtime,
		setPlaytime,
		activeMenu,
		setActiveMenu,
		members,
		setMembers,
		fileUrl,
		setFileUrl,
	};

	return (
		<playerContext.Provider value={player}>
			{children}
		</playerContext.Provider>
	);
};
