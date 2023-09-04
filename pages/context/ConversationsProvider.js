import React, { useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const ConversationsContext = React.createContext();

export function useConversations() {
  return useContext(ConversationsContext);
}

export function ConversationsProvider({ children }) {
  const [conversations, setConversations] = useLocalStorage("conversations", []);

  function createConversation(recipents) {
    setConversations(prevConversations => {
      return [...prevConversations, {recipents, messages : []}];
    });
  }

  return (
    <ConversationsContext.Provider value={{ conversations, createConversation}}>
      {children}
    </ConversationsContext.Provider>
  );
}
