import "@/styles/globals.css";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { Rubik } from "next/font/google";
import Navbar from "./components/Navbar";
import LoadingBar from "react-top-loading-bar";

import { PlayerState } from "./context/playerContext";
import { UserProvider } from "./context/userContext";

import { SessionProvider } from "next-auth/react";

export default function App({
	Component,
	pageProps: { session, ...pageProps },
}) {
	const [progress, setProgress] = useState(0);
	const router = useRouter();

	useEffect(() => {
		router.events.on("routeChangeStart", () => {
			setProgress(40);
		});

		router.events.on("routeChangeComplete", () => {
			setProgress(100);
		});
		router.events.on("routeChangeError", () => {
			setProgress(0);
		});
	}, [router]);

	return (
		<>
			<SessionProvider session={session}>
				<UserProvider>
					<PlayerState>
						<LoadingBar
							color="#BD0000"
							progress={progress}
							waitingTime={400}
							onLoaderFinished={() => setProgress(0)}
						/>
						<Navbar />
						<main>
							<Component {...pageProps} />
						</main>
					</PlayerState>
				</UserProvider>
			</SessionProvider>
		</>
	);
}
