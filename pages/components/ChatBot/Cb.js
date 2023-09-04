import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import { Poppins } from "next/font/google";
import { Transition } from "@headlessui/react";

const poppins = Poppins({
	weight: ["500", "600", "700", "800"],
	subsets: ["latin"],
	display: "swap",
});

const Cb = () => {
	const DefaultBotMessage = "Invictus here! Click on me to chat further.";
	const [messages, setMessages] = useState([DefaultBotMessage]);
	const showAlertAfterMilliSeconds = (alertConfig, type, milliseconds) => {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				if (type === "swal") {
					resolve(Swal.fire(alertConfig));
				}
			}, milliseconds);
		});
	};
	const fn = async () => {
		const nameAlert = await Swal.fire({
			title: "Kimi no nawa",
			input: "text",
			inputLabel: "Your Name",
			inputPlaceholder: "Enter your name",
		});

		if (nameAlert.isConfirmed && nameAlert.value) {
			const name = nameAlert.value;
			setMessages((oldMessages) => [
				...oldMessages,
				`The name's ${name}`,
			]);

			try {
				const shortMovieAlert = await showAlertAfterMilliSeconds(
					{
						icon: "question",
						title: "Wanna watch a short movie?",
						showCancelButton: true,
						confirmButtonColor: "#3085d6",
						cancelButtonColor: "#d33",
						confirmButtonText: "Yes, lets go",
					},
					"swal",
					2000
				);

				if (shortMovieAlert.isConfirmed && shortMovieAlert.value) {
					const roomId = uuidv4();
					setMessages((oldMessages) => [
						...oldMessages,
						`Here is your room id: ${roomId}`,
					]);
					navigator.clipboard.writeText(roomId);
					toast(
						`here's my room id: ${roomId}. It is already copied to your clipboard :)`,
						{
							icon: "🔔",
							position: "bottom-right",
							autoClose: 2000,
							hideProgressBar: false,
							closeOnClick: false,
							pauseOnHover: false,
							draggable: true,
							progress: undefined,
							theme: "dark",
						}
					);

					try {
						const showRoomIdAlert =
							await showAlertAfterMilliSeconds(
								{
									icon: "info",
									title: "You owe me smth...",
									input: "text",
									inputLabel: "Ctrl + V / paste",
									inputPlaceholder: "ID",
									preConfirm: (value) => {
										if (value !== roomId) {
											Swal.showValidationMessage(
												"Wrong Room ID"
											);
										}
									},
								},
								"swal",
								4000
							);

						if (
							showRoomIdAlert.isConfirmed &&
							showRoomIdAlert.value
						) {
							setMessages((oldMessages) => [
								...oldMessages,
								"Let's go...",
							]);
						} else {
							setMessages([DefaultBotMessage]);
						}
					} catch (error) {}
				} else {
					setMessages([DefaultBotMessage]);
				}
			} catch (error) {
				console.error(error);
			}
		} else {
			setMessages([DefaultBotMessage]);
		}
	};
	return (
		<>
			<ToastContainer
				position="bottom-center"
				autoClose={2000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
			/>
			<div className="flex max-h-[25rem] min-h-[15rem] w-full flex-col self-end rounded-md bg-[#202020] md:h-auto md:w-1/3 md:self-auto">
				<div className="flex h-full flex-col gap-3 overflow-y-auto overflow-x-hidden p-5">
					{messages.map((msg, index) => {
						return (
							<MessageItem
								key={index}
								onClickEvent={msg === messages[0] ? fn : null}
								className={`${
									msg === messages[0] ? "cursor-pointer" : ""
								} ${
									(index + 1) % 2 === 0
										? "ml-auto text-right"
										: ""
								}`}
								enterFrom={`${
									(index + 1) % 2 === 0
										? "opacity-0 translate-x-3"
										: "opacity-0 -translate-x-3"
								}`}
								enterTo={`opacity-100 translate-x-0`}
								message={msg}
							/>
						);
					})}
				</div>
				<input
					type="text"
					className={`${poppins.className} mt-auto w-full rounded-b-md border-t bg-transparent px-3 py-2 text-white outline-none placeholder:font-light placeholder:text-gray-200`}
					placeholder="Talk with the bot"
				/>
			</div>
		</>
	);
};

const MessageItem = (props) => {
	const [show, setShow] = useState(false);
	useEffect(() => {
		setShow(true);
	}, []);

	return (
		<Transition
			show={show}
			enter="transition-opacity transition-transform duration-200"
			enterFrom={props.enterFrom}
			enterTo={props.enterTo}
		>
			<p
				onClick={props.onClickEvent}
				className={`${props.className} max-w-max rounded-md bg-white/80 p-1 text-black`}
			>
				{props.message}
			</p>
		</Transition>
	);
};

export default Cb;
