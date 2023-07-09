import "@/styles/globals.css";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { Rubik } from "next/font/google";
import Navbar from "./components/Navbar";
import LoadingBar from "react-top-loading-bar";
import { PlayerState } from "./context/playerContext";

const rubik = Rubik({
	weight: ["500", "800", "900"],
	subsets: ["latin"],
	display: "swap",
});

export default function App({ Component, pageProps }) {
	const [progress, setProgress] = useState(0);
	const router = useRouter();

	useEffect(() => {
		router.events.on("routeChangeStart", () => {
			setProgress(40);
		});

		router.events.on("routeChangeComplete", () => {
			setProgress(100);
		});
	}, [router]);

	return (
		<>
			<PlayerState>
				<LoadingBar
					color="#BD0000"
					progress={progress}
					waitingTime={400}
					onLoaderFinished={() => setProgress(0)}
				/>
				<main className={rubik.className}>
					<Navbar />
					<Component {...pageProps} />
				</main>
			</PlayerState>
		</>
	);
}
