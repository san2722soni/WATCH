import React, { useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const ContactsContext = React.createContext();

export function useContacts() {
  return useContext(ContactsContext);
}

export function ContactsProvider({ children }) {
  const [contacts, setContacts] = useLocalStorage("contacts", []);

 function createContact (id, name) {
     setContacts((prevContacts) => {
      return [...prevContacts, { id, name }];
    });
  }
  
  function editContact(id, name) {
    contacts.map((contact, index) => {
      if (id === contact.id) {
        setContacts((prevContacts) => {
          prevContacts[index].name = name;
          return [...prevContacts];
        });
        return;
      }
    });
  }

  function deleteContact(id, name){
    const LeftOutContacts = contacts.filter((contact) => {
      return id !== contact.id;
    });

    setContacts(prevContacts => {
      return [...LeftOutContacts]
    });
  }

  return (
    <ContactsContext.Provider value={{ contacts, createContact, editContact, deleteContact}}>
      {children}
    </ContactsContext.Provider>
  );
}
