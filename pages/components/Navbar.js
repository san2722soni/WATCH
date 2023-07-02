import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
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

	// Cheking if user already logged in
	useEffect(() => {
		if (localStorage.getItem("token")) {
			setIcon(true);
		}
	}, []);
	return (
		<header className="text-white">
			<div
				className={`container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center justify-between ${rubik.className} font-sans`}
			>
				<Link href={"/"}>
					<FaLaptopCode className="text-5xl hover:text-red-600 cursor-pointer"></FaLaptopCode>
				</Link>
				<nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center ml-10">
					<Link
						href="/"
						className="mr-10 hover:text-red-600 cursor-pointer"
					>
						HOME
					</Link>
					<Link
						href="/about"
						className="mr-10 hover:text-red-600 cursor-pointer"
					>
						ABOUT
					</Link>
					<Link
						href="/room"
						className="mr-10 hover:text-red-600 cursor-pointer"
					>
						ROOM
					</Link>
					<Link
						href="/contact"
						className="mr-10 hover:text-red-600 cursor-pointer"
					>
						CONTACT
					</Link>
				</nav>
				<Link href={"/signup"}>
					{!icon && (
						<button className="hover:bg-red-800 inline-flex items-center border-0 bg-[#BD0000] py-1 px-3 rounded-full text-lg mt-4 md:mt-0">
							Get-Started
							<svg
								fill="none"
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								className="w-4 h-4 ml-1"
								viewBox="0 0 24 24"
							>
								<path d="M5 12h14M12 5l7 7-7 7"></path>
							</svg>
						</button>
					)}

					{icon && (
						<button className="">
							<RiAccountCircleLine className="text-5xl hover:text-red-600 cursor-pointer" />
						</button>
					)}
				</Link>
			</div>
		</header>
	);
};

export default Navbar;
