import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'

import { Poppins } from "next/font/google";
import { Rubik } from "next/font/google";

const poppins = Poppins({
  weight: ["500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

const rubik = Rubik({
  weight: ["300", "400", "500", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

const Chat = (props) => {

  const { MembersDropdown } = props;

  const [message, setMessage] = useState("Loading");

  useEffect(() => {
    fetch('http://localhost:5000/api/home').then(
      response => response.json()
    ).then(
      data => {
        console.log(data);
        setMessage(data.message);
      }
    )
  }, [])

  const socket = io('http://localhost:8080')
  socket.emit("custom-event", 10, 'Hi', {a: 'aa'});

  return (
    <section className={`${poppins.className} relative flex min-h-[20rem] w-full flex-col rounded-md bg-[#202020] text-center text-xl text-white md:w-1/3`}>
      <h3 className="border-b p-2">{message}</h3>
      <input
        type="text"
        className="mt-auto w-full bg-black/50 p-3 text-sm font-light outline-none placeholder:text-gray-300"
        placeholder="Type your message here."
      />
      <div className="absolute -top-10 right-0">
        <MembersDropdown />
      </div>
    </section>
  )
}

export default Chat