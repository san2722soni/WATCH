import React, { useState, useEffect, useContext, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaLaptopCode } from "react-icons/fa";
import { RiAccountCircleLine } from "react-icons/ri";
import { useSession } from "next-auth/react";

import { Poppins } from "next/font/google";
import { createAvatar } from "@dicebear/core";
import { identicon } from "@dicebear/collection";
import { UserContext } from "../context/userContext";

const poppins = Poppins({
	weight: ["300", "500", "800", "900"],
	subsets: ["latin"],
	display: "swap",
});

const Navbar = () => {
	// Manipulating icon according to sign-up status
	const [avatar, setAvatar] = useState();
	// const [user, setUser] = useState();
	const router = useRouter();
	const { data: session } = useSession();
	const { user, setUser } = useContext(UserContext);

	useEffect(() => {
		if (!session || session.loading) {
			return; // Wait for session to finish loading
		}
		if (user) {
			setAvatar(
				createAvatar(identicon, {
					size: 128,
					seed: user.profilePic.randomSeed,
				}).toDataUriSync()
			);
		}
	}, [session, user]);

	return (
		<header className="z-50 bg-gradient-to-b from-neutral-700 to-transparent text-white">
			<div
				className={`container mx-auto flex flex-col flex-wrap items-center justify-between p-5 md:flex-row ${poppins.className} font-light`}
			>
				<Link
					href={"/"}
					className="outline-none transition duration-300 hover:scale-110 focus:scale-110"
				>
					{/* <FaLaptopCode className="cursor-pointer text-5xl hover:text-red-600"></FaLaptopCode> */}
					<div className="relative h-14 w-14">
						<Image
							fill
							src="/assets/logo.svg"
							className="cursor-pointer hover:text-red-600"
							alt=""
						/>
					</div>
				</Link>
				<nav className="mb-5 flex flex-wrap items-center justify-center gap-10 text-base md:mb-0">
					<Link
						href="/"
						className={`${
							router.pathname === "/" ? "text-red-600" : ""
						} cursor-pointer outline-none hover:underline`}
					>
						HOME
					</Link>
					{/* <Link
						href="/about"
						className={`${
							router.pathname === "/about" ? "text-red-600" : ""
						} mr-10 cursor-pointer outline-none hover:underline`}
					>
						ABOUT
					</Link> */}
					<Link
						href="/joinRoom"
						className={`${
							router.pathname === "/room" ||
							router.pathname === "/joinRoom"
								? "text-red-600"
								: ""
						} cursor-pointer outline-none hover:underline`}
					>
						ROOM
					</Link>
					{/* <Link
						href="/contact"
						className={`${
							router.pathname === "/contact" ? "text-red-600" : ""
						} cursor-pointer outline-none hover:underline`}
					>
						CONTACT
					</Link> */}
				</nav>
				{!session && (
					<button className="mt-4 rounded-full border-0 bg-[#BD0000] px-3 py-1 text-lg outline-none hover:bg-red-800 focus:ring-2 focus:ring-white md:mt-0">
						<Link
							className="inline-flex items-center outline-none"
							href={"/login"}
						>
							Sign In
							<svg
								fill="none"
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								className="ml-1 h-4 w-4"
								viewBox="0 0 24 24"
							>
								<path d="M5 12h14M12 5l7 7-7 7"></path>
							</svg>
						</Link>
					</button>
				)}
				{session && (
					<button className="outline-none transition-transform duration-300 ease-in-out hover:scale-110 focus:scale-110">
						<Link href={"/userInfo"}>
							<img
								src={avatar}
								className="h-10 w-10 rounded-full bg-black"
								alt=""
							/>
						</Link>
					</button>
				)}
			</div>
		</header>
	);
};

export default Navbar;
