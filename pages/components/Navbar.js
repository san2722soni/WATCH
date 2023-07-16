import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaLaptopCode } from "react-icons/fa";
import { RiAccountCircleLine } from "react-icons/ri";

import { Rubik } from "next/font/google";

const rubik = Rubik({
	weight: ["500", "800", "900"],
	subsets: ["latin"],
	display: "swap",
});

const Navbar = () => {
	// Manipulating icon according to sign-up status
	const [icon, setIcon] = useState(false);
	const router = useRouter();

	// Cheking if user already logged in
	useEffect(() => {
		if (localStorage.getItem("token")) {
			setIcon(true);
		}
	}, []);
	return (
		<header className="text-white">
			<div
				className={`container mx-auto flex flex-col flex-wrap items-center justify-between p-5 md:flex-row ${rubik.className} font-sans`}
			>
				<Link href={"/"}>
					<FaLaptopCode className="cursor-pointer text-5xl hover:text-red-600"></FaLaptopCode>
				</Link>
				<nav className="ml-10 flex flex-wrap items-center justify-center text-base md:ml-auto md:mr-auto">
					<Link
						href="/"
						className={`${
							router.pathname === "/" ? "text-red-600" : ""
						} mr-10 cursor-pointer hover:text-red-600`}
					>
						HOME
					</Link>
					<Link
						href="/about"
						className={`${
							router.pathname === "/about" ? "text-red-600" : ""
						} mr-10 cursor-pointer hover:text-red-600`}
					>
						ABOUT
					</Link>
					<Link
						href="/room"
						className={`${
							router.pathname === "/room" ? "text-red-600" : ""
						} mr-10 cursor-pointer hover:text-red-600`}
					>
						ROOM
					</Link>
					<Link
						href="/contact"
						className={`${
							router.pathname === "/contact" ? "text-red-600" : ""
						} mr-10 cursor-pointer hover:text-red-600`}
					>
						CONTACT
					</Link>
				</nav>
				<Link href={"/signup"}>
					{!icon && (
						<button className="mt-4 inline-flex items-center rounded-full border-0 bg-[#BD0000] px-3 py-1 text-lg hover:bg-red-800 md:mt-0">
							Get-Started
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
						</button>
					)}

					{icon && (
						<button className="">
							<RiAccountCircleLine className="cursor-pointer text-5xl hover:text-red-600" />
						</button>
					)}
				</Link>
			</div>
		</header>
	);
};

export default Navbar;
