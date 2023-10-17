"use client";
import { signOut, useSession } from "next-auth/react";
// import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useMemo, useState, useContext, useEffect } from "react";

import { createAvatar } from "@dicebear/core";
import { identicon } from "@dicebear/collection";
import { UserContext } from "./context/userContext";
const { v4: uuidv4 } = require("uuid");
import { BsStars } from "react-icons/bs";
import { Transition } from "@headlessui/react";

const UserInfo = () => {
	const { data: session } = useSession();
	const router = useRouter();

	const selectedStyle = identicon;

	const { user, setUser } = useContext(UserContext);
	const [randomSeed, setRandomSeed] = useState();

	useEffect(() => {
		if (user) {
			setRandomSeed(user.profilePic.randomSeed);
		}
	}, [session, user]);

	const [avatar, setAvatar] = useState();
	const [show, setShow] = useState(false);

	useMemo(() => {
		setAvatar(
			createAvatar(selectedStyle, {
				size: 128,
				seed: randomSeed,
			}).toDataUriSync()
		);
	}, [selectedStyle, randomSeed]);

	const handleSave = async () => {
		const updatedUser = {
			...user,
			profilePic: { ...user.profilePic, randomSeed },
		};
		setUser(updatedUser);
		await fetch("http://localhost:3000/api/updateUser", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ user: updatedUser }),
		});
	};
	useEffect(() => {
		setTimeout(() => {
			setShow(true);
		}, 100);

		if (router.isReady) {
			if (session) return;
			router.push("/signup");
		}
	}, []);

	if (session) {
		return (
			<Transition
				show={show}
				enter="transition-opacity duration-300"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="transition-opacity duration-75"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<main className="relative h-[calc(100vh-6.5rem)]">
					{/* Background image */}
					<div
						className="absolute inset-0"
						style={{
							backgroundImage: `url("${avatar}")`,
							backgroundSize: "cover",
							backgroundRepeat: "no-repeat",
							filter: "brightness(30%) blur(1.5rem)", // Adjust the brightness value as needed
						}}
					></div>

					{/* Content */}
					<div className="relative z-10 flex flex-col items-center gap-4">
						<button
							onClick={() => signOut()}
							className="w-2/3 rounded-lg bg-white p-3 text-black duration-150 hover:bg-gray-100 active:shadow-lg md:w-fit"
						>
							Sign Out
						</button>

						<section className="flex flex-col items-center gap-5">
							<h1 className="text-3xl font-semibold text-white">
								Avatar Generator
							</h1>
							<img
								src={avatar}
								className="select-none rounded-full bg-black"
								alt=""
							/>

							<button
								onClick={() => setRandomSeed(uuidv4())}
								className="flex h-10 w-10 items-center justify-center rounded-full bg-white px-2 py-3 text-black"
							>
								<BsStars className="" />
							</button>
							<button
								onClick={handleSave}
								className="rounded-md bg-white p-3 text-black"
							>
								Save
							</button>
						</section>
					</div>
				</main>
			</Transition>
		);
	}
};

export default UserInfo;
