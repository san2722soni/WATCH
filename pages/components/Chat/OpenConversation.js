import React, { useState, useEffect , useMemo, useCallback} from "react";
import io from "socket.io-client";
import { useConversations } from "@/pages/context/ConversationsProvider";

const OpenConversation = ({ reveal, id }) => {
  const { conversations, selectedConvo , sendMessaage} = useConversations();

  const [msg, setMsg] = useState("");
  const [message, setMessage] = useState("Loading");
  const [talking, setTalking] = useState(true);
  const setRef = useCallback(node => {
    if (node) {
      node.scrollIntoView({smooth: true});
    }
  }, [])
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

  const selectedContactDetail = conversations.filter((conversation, index) => {
    return selectedConvo === index;
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    sendMessaage(selectedContactDetail[0].recipients.map(r => r.id), msg)
    setMsg('');
    setMessage(msg);
  };

  return (
    <>
      <div
        className={`flex h-0 flex-grow flex-col overflow-auto p-4 ${
          reveal ? "visible" : "hidden"
        }`}
      >
        <div className="mt-2 flex w-full max-w-xs space-x-3">
          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300"></div>
          <div>
            <div className="rounded-r-lg rounded-bl-lg bg-white p-3">
              {reveal &&
                selectedContactDetail[0].recipients.map(
                  (contact) => contact.name
                )}
            </div>
            <span className="text-xs leading-none text-gray-500">
              2 min ago
            </span>
          </div>
        </div>
        <div className="ml-auto mt-2 flex w-full max-w-xs justify-end space-x-3">
          <div>
            <div className="rounded-l-lg rounded-br-lg bg-gray-200 p-3 text-[#202020]">
              <p className="text-sm"></p>
            </div>
            <span className="text-xs leading-none text-gray-500">
              2 min ago
            </span>
          </div>
          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300"></div>
        </div>
          <div className="bg-[#202020] p-4">
            <input
              className="flex h-10 w-full items-center rounded bg-white px-3 text-sm text-[#202020]"
              type="text"
              placeholder="Type your message…"
              onChange={(e) => setMsg(e.target.value)}
            />
            <button
              type="submit"
              className="m-auto mt-2 w-fit bg-white px-5 py-1 text-[#202020]"
              onClick={handleSubmit}
            >
              SEND
            </button>
          </div>
      </div>
    </>
  );
};

export default OpenConversation;
