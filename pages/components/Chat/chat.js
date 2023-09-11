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
import Conversations from "./Conversations";

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

  const [id, setId] = useLocalStorage("id");
  const [talking, setTalking] = useState(true);

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
      <ContactsProvider>
        <ConversationsProvider id={id}>
          <div
            className={`flex h-screen w-full max-w-xl flex-grow flex-col overflow-hidden rounded-sm bg-[#202020] shadow-xl`}
          >
            {/* TAB SYSTEM */}
            <div className="flex w-full cursor-pointer flex-row bg-[#202020]">
              <div
                className={`w-1/2 border-2 border-white px-5 py-2 ${
                  talking
                    ? "bg-white text-[#202020]"
                    : "bg-[#202020] text-white"
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
              <Conversations id={id}/>
            </div>

            {/* CHAT AUTH */}
            <ChatAuth
              style={`${id === undefined && !talking ? "visible" : "hidden"}`}
              onIdSubmit={setId}
            />

            {/* CONTACTS */}
            <Contacts
              style={`${id !== undefined && !talking ? "visible" : "hidden"}`}
              id={id}
            />
          </div>
          <div className="absolute -top-10 right-0">
            <MembersDropdown />
          </div>
        </ConversationsProvider>
      </ContactsProvider>
    </>
  );
};

export default Chat;
