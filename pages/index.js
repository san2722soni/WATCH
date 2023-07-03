import Image from "next/image";
import Link from "next/link";
import Chatbot from "./components/Chatbot";

export default function Home() {

  return (
    <>
      <title>{`WATCH - Watch together, even when apart`}</title>
      <meta name='description' content='WATCH - Watch together, even when apart'></meta>
      <Link href={'../public/image.png'}></Link>

      <main>
        <div>
          <h1 className="text-4xl text-white text-center mt-10">Watch <span className="text-[#BD0000]">together</span>, even when apart</h1>
          <h2 className="text-base text-white text-center mt-5">Connect through the power of live video watching, for FREE!</h2>
          <div className="BOX m-auto mt-10 " style={{ height: "25rem" }}>
            {/* TODO */}
          </div>
          <Chatbot />
        </div>
      </main>
    </>
  )
}