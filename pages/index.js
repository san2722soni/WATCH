import Image from "next/image";
import Link from "next/link";

export default function Home() {
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
					<h1 className="mt-10 text-center text-4xl text-white">
						Watch <span className="text-red-600">together</span>,
						even when apart
					</h1>
					<h2 className="mt-5 text-center text-base text-white">
						Connect through the power of live video watching, for
						FREE!
					</h2>
					<div className="m-auto mt-10 h-[25rem] w-1/2 rounded-md bg-[#E4E4E4] shadow-white-glow shadow-white/40">
						{/* TODO */}
					</div>
				</div>
			</main>
		</>
	);
}
