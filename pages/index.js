import React, { useState, useEffect } from "react";
import Link from "next/link";
import Cb from "./components/ChatBot/Cb";
import { Urbanist, Poppins } from "next/font/google";
import Image from "next/image";

const urbanist = Urbanist({
	weight: ["400", "800"],
	subsets: ["latin"],
	display: "swap",
});

const poppins = Poppins({
	weight: ["400", "500", "600", "700"],
	subsets: ["latin"],
	display: "swap",
});

export default function Home() {
	// const [start, setStart] = useState(false);
	return (
		<>
			<title>{`WATCH - Watch together, even when apart`}</title>
			<meta
				name="description"
				content="WATCH - Watch together, even when apart"
			></meta>
			<Link href={"../public/image.png"}></Link>

			<main className={`box ${poppins.className}`}>
				<h1
					className={`mt-5 text-center text-5xl text-white ${urbanist.className} font-extrabold`}
				>
					Watch <span className="text-red-600">together</span>, even
					when apart
				</h1>
				<h2 className="mt-5 text-center text-lg text-white">
					Connect through the power of live video watching, for FREE!
				</h2>

				<div className="mt-10 flex flex-col gap-5 px-5 md:flex-row">
					<div className="movie mx-auto h-auto cursor-pointer rounded-md bg-[#E4E4E4] shadow-white-glow shadow-white/20 md:w-3/4">
						{/* TODO */}
						<video
							controlsList="nodownload"
							muted
							controls
							className="h-full w-full rounded-md outline-none"
						>
							<source src="./assets/Website-Showcase-Tutorial.mp4" />
						</video>
					</div>
					{/* <Chatbot /> */}
					{/* <Cb /> */}
				</div>

				<section className="relative mt-20 bg-white px-10 py-5">
					<div class="wave">
						<svg
							data-name="Layer 1"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 1200 120"
							preserveAspectRatio="none"
						>
							<path
								d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
								class="shape-fill"
							></path>
						</svg>
					</div>
					<div className="mt-28 space-y-36 md:mt-0 md:space-y-14">
						<div className="h-72 items-center justify-center md:flex">
							<div className="mb-5 flex flex-col gap-3 md:mb-0">
								<p className="text-lg md:text-xl">
									Real Time Sync
								</p>
								<p className="max-w-2xl">
									Experience videos together in perfect
									harmony with our real-time synchronization,
									ensuring everyone is on the same frame,
									every second.
								</p>
							</div>
							<div className="relative h-4/5 w-full select-none md:w-3/5">
								<Image
									className="h-full w-full object-contain"
									fill
									src={"/assets/sync_svg.svg"}
								></Image>
							</div>
						</div>
						<div className="h-72 items-center justify-center md:flex">
							<div className="mb-5 flex flex-col gap-3 sm:flex-col">
								<p className="text-lg md:text-xl">
									Chat with your friends
								</p>
								<p className="max-w-2xl">
									Connect with friends seamlessly through our
									built-in chat feature, bringing the joy of
									conversation right into your shared viewing
									experience.
								</p>
							</div>
							<div className="relative h-4/5 w-full select-none md:w-3/5">
								<Image
									className="h-full w-full object-contain "
									fill
									src={"/assets/group_chat_svg.svg"}
								></Image>
							</div>
						</div>
						<div className="h-72 items-center justify-center md:flex">
							<div className="mb-5 flex flex-col gap-3 sm:flex-col">
								<p className="text-lg md:text-xl">Easy Setup</p>
								<p className="max-w-2xl">
									No hassle, no stress. Our intuitive setup
									process lets you create an account, set up a
									room, and start watching with friends
									effortlessly.
								</p>
							</div>
							<div className="relative h-3/5 w-full select-none md:w-3/5">
								<Image
									className="h-full w-full object-contain "
									fill
									src={"/assets/easy_setup_svg.svg"}
								></Image>
							</div>
						</div>
					</div>
				</section>
			</main>
		</>
	);
}
