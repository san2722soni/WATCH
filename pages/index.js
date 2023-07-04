import React, { useState, useEffect } from "react";
import Link from "next/link";
import Chatbot, { fireName } from "./components/Chatbot";


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
					<h1 className="text-4xl text-white text-center mt-5">
						Watch <span className="text-red-600">together</span>,
						even when apart
					</h1>
					<h2 className="text-base text-white text-center mt-5">
						Connect through the power of live video watching, for
						FREE!
					</h2>

					<div className="flex ">
						<div className="w-9/12 cursor-pointer h-[25rem] shadow-white-glow shadow-white/40 mt-10 mx-10 bg-[#E4E4E4] rounded-md movie">
							{/* TODO */}
						</div>
					<Chatbot />
					</div>
						{/* <button onClick={()=>{setStart(true)}} className="inline-flex text-white bg-indigo-500 border-0 py-1 px-4 focus:outline-none hover:bg-indigo-600 rounded mt-5">HAJI-MEI</button> */}
				</div>
			</main>
		</>
	);
}

