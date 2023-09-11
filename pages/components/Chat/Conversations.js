import React, { useEffect, useState } from "react";
import { BsArrowRight, BsFillArrowLeftSquareFill } from "react-icons/bs";
import { useConversations } from "@/pages/context/ConversationsProvider";
import OpenConversation from "./OpenConversation";

const Conversations = ({ id }) => {
  const { conversations, selectConversationIndex } = useConversations();
  const [reveal, shouldReveal] = useState(false);

  const openConversation = (index) => {
    selectConversationIndex(index);
    shouldReveal(true);
  };

  return (
    <>
      <BsFillArrowLeftSquareFill className={`m-3 cursor-pointer text-3xl text-white ${reveal ? 'visible' : 'hidden'}`} onClick={() => shouldReveal(!reveal)}/>
      <div
        className={`flex h-0 flex-grow flex-col overflow-auto p-4 ${
          reveal ? "hidden" : "visible"
        }`}
      >
        <ul class="w-96 cursor-pointer">
          {conversations.map((conversation, index) => {
            return (
              <li
                key={index}
                class="flex w-full border-b-2 border-neutral-100 border-opacity-100 py-4 text-white"
                onClick={() => openConversation(index)}
              >
                {conversation.recipients.map((r) => r.name).join(", ")}
                <span className="ml-auto mr-5 text-2xl">
                  <BsArrowRight />
                </span>
              </li>
            );
          })}
        </ul>
      </div>
      <OpenConversation reveal={reveal} id={id}/>
    </>
  );
};

export default Conversations;
