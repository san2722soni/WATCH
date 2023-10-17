require("dotenv").config(); // dotenv

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { FaLaptopCode } from "react-icons/fa";

const Signup = () => {
	const router = useRouter();

	const [name, setName] = useState();
	const [email, setEmail] = useState();
	const [password, setPassword] = useState();

	const { data: session } = useSession();
	if (session) router.push("/");

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const resUserExists = await fetch(
				"http://localhost:3000/api/userExists",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email }),
				}
			);

			const user = await resUserExists.json();

			if (user.length) {
				console.log("User already exists"); // pls display an error to the user. (in the ui)
				return;
			}

			const res = await fetch("http://localhost:3000/api/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name, email, password }),
			});

			if (res.ok) {
				const form = e.target;
				form.reset();
				router.push("/login");
			} else {
				console.log("user registration failed!");
			}
		} catch (error) {
			console.error("Error during registration: ", error);
		}
	};

	return (
		<>
			{!session && (
				<div className="flex flex-col items-center justify-center lg:py-0">
					<div className="w-full rounded-lg shadow sm:max-w-md md:mt-0 xl:p-0">
						<div className="space-y-4 p-6 sm:p-8 md:space-y-6">
							<h1 className="text-2xl font-bold leading-tight tracking-tight dark:text-white md:text-4xl">
								Create an account
							</h1>
							<p className="text-base font-light text-gray-500 dark:text-gray-400">
								Already have an account?{" "}
								<Link
									href={"/login"}
									className="text-primary-600 font-medium outline-none hover:underline focus:underline"
								>
									Login here
								</Link>
							</p>
							<form
								onSubmit={handleSubmit}
								className="space-y-4 md:space-y-6"
								action="POST"
							>
								<div>
									<label
										htmlFor="name"
										className="mb-2 block text-sm font-medium dark:text-white"
									>
										Name
									</label>
									<input
										onChange={(e) =>
											setName(e.target.value)
										}
										type="text"
										name="name"
										id="name"
										placeholder="John Doe"
										className="w-full rounded-lg bg-white px-3 py-2 outline-none transition duration-150 placeholder:text-gray-500 focus:ring focus:ring-red-700"
										required
									/>
								</div>
								<div>
									<label
										htmlFor="email"
										className="mb-2 block text-sm font-medium dark:text-white"
									>
										Your email
									</label>
									<input
										onChange={(e) =>
											setEmail(e.target.value)
										}
										type="email"
										name="email"
										id="email"
										className="w-full rounded-lg bg-white px-3 py-2 outline-none transition duration-150 placeholder:text-gray-500 focus:ring focus:ring-red-700"
										placeholder="name@company.com"
										required
									/>
								</div>
								<div>
									<label
										htmlFor="password"
										className="mb-2 block text-sm font-medium dark:text-white"
									>
										Password
									</label>
									<input
										onChange={(e) =>
											setPassword(e.target.value)
										}
										type="password"
										name="password"
										id="password"
										placeholder="••••••••"
										className="w-full rounded-lg bg-white px-3 py-2 outline-none transition duration-150 placeholder:text-gray-500 focus:ring focus:ring-red-700"
										required
									/>
								</div>
								<button
									type="submit"
									className="bg-primary-600 w-full rounded-lg bg-white px-5 py-2.5 text-center text-base font-medium text-black outline-none transition duration-150 hover:text-red-700 focus:text-red-700 focus:ring focus:ring-red-700"
								>
									Create an account
								</button>
							</form>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Signup;
