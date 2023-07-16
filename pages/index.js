import React, { useState, useEffect } from "react";
import Link from "next/link";
import Chatbot, { fireName } from "./components/Chatbot";
import Cb from "./components/Cb";

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

			<main className="box">
				<div>
					<h1 className="mt-5 text-center text-4xl text-white">
						Watch <span className="text-red-600">together</span>,
						even when apart
					</h1>
					<h2 className="mt-5 text-center text-base text-white">
						Connect through the power of live video watching, for
						FREE!
					</h2>

					<div className="mt-10 flex flex-col gap-5 px-5 md:flex-row">
						<div className="movie h-[25rem] w-full cursor-pointer rounded-md bg-[#E4E4E4] shadow-white-glow shadow-white/40 md:w-9/12">
							{/* TODO */}
						</div>
						{/* <Chatbot /> */}
						<Cb />
					</div>
					{/* <button onClick={()=>{setStart(true)}} className="inline-flex text-white bg-indigo-500 border-0 py-1 px-4 focus:outline-none hover:bg-indigo-600 rounded mt-5">HAJI-MEI</button> */}
				</div>
			</main>
		</>
	);
}
