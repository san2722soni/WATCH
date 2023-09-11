import React, { useContext, useEffect, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";


const ConversationsContext = React.createContext();

export function useConversations() {
  return useContext(ConversationsContext);
}

export function ConversationsProvider({ id, children }) {
  const [conversations, setConversations] = useLocalStorage("conversations", []);
  const [Fconvo, setFConvo] = useLocalStorage("Fconvo", []); // formatted form of conversations
  const [selectedConversationIndex, setSelectedConversationIndex] = useState(0);

  function createConversation(recipients) {
    setConversations(prevConversations => {
      return [...prevConversations, {recipients, messages : []}];
    });
  }

  function addMessageToConversation({recipients, text, sender}){
    setFConvo(prevConversation => {
      let madeChange = false;
      const newMessage = { sender, text };
      const newConversations = prevConversation.map(conversation => {
        if (arrayEquality(conversation.recipients, recipients)){
          madeChange = true;
          console.log(madeChange, 'sdfs')
          return {
            ...conversation,
            messages: [...conversation.messages, newMessage]
          }
        }
        return conversation;
      })
      if (madeChange){
        return newConversations
      } else {
        return[...prevConversation, 
          {recipients, messages: [newMessage]}
        ]
      }
    })
  }

  function sendMessaage(recipients, text){
    const filteredRecipients = conversations.map(conversation => ({
      recipients: conversation.recipients.map(recipient => recipient.id),
      messages: []
    }));
    
    setFConvo(filteredRecipients);
      addMessageToConversation({recipients, text, sender: id})
  }

  const value = {
    conversations: conversations,
    selectConversationIndex: setSelectedConversationIndex,
    selectedConvo: selectedConversationIndex,
    createConversation,
    sendMessaage
  }
  return (
    <ConversationsContext.Provider value={value}>
      {children}
    </ConversationsContext.Provider>
  );
}

 
function arrayEquality(array1, array2){
  if (array1.length !== array2.length) return false;

  array1.sort();
  array2.sort();

  return array1.every((element, index) => {
    return element === array2[index]
  })
}
