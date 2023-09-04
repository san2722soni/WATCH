"use client";
import React, { useEffect, useState, useMemo, useRef } from "react";
import io from "socket.io-client";

import { Poppins } from "next/font/google";
import { Rubik } from "next/font/google";
import { usePathname } from "next/navigation";
import ChatAuth from "./ChatAuth";
import useLocalStorage from "@/pages/hooks/useLocalStorage";
import Contacts from "./Contacts";
import { ContactsProvider } from "@/pages/context/ContactsProvider";
import { ConversationsProvider } from "@/pages/context/ConversationsProvider";

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

  let pathname = usePathname();

  const [msg, setMsg] = useState("");
  const [id, setId] = useLocalStorage("id");
  const [message, setMessage] = useState("Loading");
  const [talking, setTalking] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/socket")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setMessage(data.message);
      });
  }, []);
  // --------------------I gotta ignore this hydration error cauz everyhting seems to working !
  // useMemo(() => {
  //   const socket = io("http://localhost:8080");
  //   socket.emit("send-message", msg);
  //   console.log("working ig ?");
  // }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(msg);
  };

  const Changetab = (e) => {
    e.preventDefault();

    if (e.target.textContent == "Join" || e.target.textContent == "Contacts") {
      setTalking(false);
    } else {
      setTalking(true);
    }
  };

  return (
    <>
      <div
        className={`flex h-screen w-full max-w-xl flex-grow flex-col overflow-hidden rounded-sm bg-[#202020] shadow-xl`}
      >
        {/* TAB SYSTEM */}
        <div className="flex w-full cursor-pointer flex-row bg-[#202020]">
          <div
            className={`w-1/2 border-2 border-white px-5 py-2 ${
              talking ? "bg-white text-[#202020]" : "bg-[#202020] text-white"
            } text-center`}
            onClick={(e) => Changetab(e)}
          >
            Talk
          </div>

          {/* AUTH */}
          <div
            className={`w-1/2 border-2 px-5 py-2 ${
              id === undefined
                ? `${
                    !talking
                      ? "text-[#202020]] bg-white"
                      : "bg-[#202020] text-white"
                  }`
                : "hidden"
            } text-center`}
            onClick={(e) => Changetab(e)}
          >
            Join
          </div>

          {/* Contacts */}
          <div
            className={`w-1/2 border-2 px-5 py-2 ${
              id === undefined
                ? "hidden"
                : `${
                    !talking
                      ? "text-[#202020]] bg-white"
                      : "bg-[#202020] text-white"
                  }`
            } text-center`}
            onClick={(e) => Changetab(e)}
          >
            Contacts
          </div>
        </div>
        <h3 className="border-b p-2 text-center text-white">
          {talking ? "Chat" : "Create Id"}
        </h3>

        {/* CHAT UI */}
        <div
          className={`flex h-96 w-full max-w-xl flex-grow flex-col overflow-hidden rounded-sm bg-[#202020] shadow-xl ${
            talking ? "visible" : "hidden"
          }`}
        >
          <div className="flex h-0 flex-grow flex-col overflow-auto p-4">
            <div className="mt-2 flex w-full max-w-xs space-x-3">
              <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300"></div>
              <div>
                <div className="rounded-r-lg rounded-bl-lg bg-white p-3">
                  <p className="text-sm">FIRST LINE</p>
                </div>
                <span className="text-xs leading-none text-gray-500">
                  2 min ago
                </span>
              </div>
            </div>
            <div className="ml-auto mt-2 flex w-full max-w-xs justify-end space-x-3">
              <div>
                <div className="rounded-l-lg rounded-br-lg bg-gray-200 p-3 text-[#202020]">
                  <p className="text-sm">{message}</p>
                </div>
                <span className="text-xs leading-none text-gray-500">
                  2 min ago
                </span>
              </div>
              <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300"></div>
            </div>
          </div>

          <div className="bg-[#202020] p-4">
            <input
              className="flex h-10 w-full items-center rounded bg-white px-3 text-sm text-[#202020]"
              type="text"
              placeholder="Type your message…"
              onChange={(e) => setMsg(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="m-auto mt-2 w-fit bg-white px-5 py-1 text-[#202020]"
            onClick={handleSubmit}
          >
            SEND
          </button>
        </div>

        {/* CHAT AUTH */}
        <ChatAuth
          style={`${id === undefined && !talking ? "visible" : "hidden"}`}
          onIdSubmit={setId}
        />

        {/* CONTACTS */}
        <ContactsProvider>
          <ConversationsProvider>
            <Contacts
              style={`${id !== undefined && !talking ? "visible" : "hidden"}`}
              id={id}
            />
          </ConversationsProvider>
        </ContactsProvider>
      </div>
      <div className="absolute -top-10 right-0">
        <MembersDropdown />
      </div>
    </>
  );
};

export default Chat;
