"use client";

require("dotenv").config();

import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { FaLaptopCode } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
	const [email, setEmail] = useState();
	const [password, setPassword] = useState();
	const [error, setError] = useState();

	const router = useRouter();
	const { data: session } = useSession();

	if (session) router.push("/");

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const res = await signIn("credentials", {
				email,
				password,
				redirect: false,
			});

			if (res.error) {
				console.log("Invalid Credentials");
				console.log(res);
				setError("Invalid email or password");
				return;
			} else {
				console.log("Logged in ok");
				router.push("/");
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			{!session && (
				<div className="mx-auto flex flex-col items-center justify-center px-6 lg:py-0">
					<div className="w-full rounded-lg shadow sm:max-w-md md:mt-0 xl:p-0">
						<div className="space-y-4 p-6 sm:p-8 md:space-y-6">
							<h1 className="text-xl font-bold leading-tight tracking-tight dark:text-white md:text-4xl">
								Sign in to your account
							</h1>
							<p className="text-base font-light text-gray-500 dark:text-gray-400">
								Don't have an account yet?{" "}
								<Link
									href={"/signup"}
									className="text-primary-600 dark:text-primary-500 font-medium outline-none hover:underline focus:underline"
								>
									Sign up
								</Link>
							</p>
							<form
								onSubmit={handleSubmit}
								className="space-y-4 md:space-y-6"
								action="POST"
							>
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
									/>
								</div>
								{error && (
									<p className="select-none rounded-md bg-red-600 p-2 text-white">
										{error}
									</p>
								)}
								<button
									type="submit"
									className="bg-primary-600 w-full select-none rounded-lg bg-white px-5 py-2.5 text-center text-sm font-medium text-black outline-none transition duration-150 hover:text-red-700 focus:text-red-700 focus:ring focus:ring-red-700"
								>
									Sign In
								</button>
							</form>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Login;
