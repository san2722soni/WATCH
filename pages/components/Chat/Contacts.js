import Swal from "sweetalert2";
import React, { useState, useEffect, useRef } from "react";
import { FaCopy } from "react-icons/fa";
import { BiEdit } from "react-icons/bi";
import { BiMessageAltDetail } from "react-icons/bi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { useContacts } from "@/pages/context/ContactsProvider";
import { useConversations } from "@/pages/context/ConversationsProvider";

const Contacts = ({ style, id }) => {
  const { contacts } = useContacts();
  const { createContact } = useContacts();
  const { editContact } = useContacts();
  const { deleteContact } = useContacts();

  const { createConversation } = useConversations();

  // Saving contact details onto local storage via createContact() hook.
  const handleSubmit = (values) => {
    createContact(parseInt(values[0]), values[1]);
  };

  // Saving new contact changes onto localstorage
  const handleUpdate = (values) => {
    editContact(parseInt(values[0]), values[1]);
  };

  // Saving newly updated array after deleting contact from list
  const handleChange = (values) => {
    // here values is an object [0:{id:'',name:''}]
    deleteContact(parseInt(values[0].id), values[0].name);
  };

  // -- Validations
  const Validations = (inp1, inp2, shouldCompareID) => {
    // Cheking for empty and fake space fields
    if (inp1.replace(/\s/g, "") == "" || inp2.replace(/\s/g, "") == "") {
      Swal.showValidationMessage("Please enter both feilds");
    }

    // Checking if contact with same id already present in runtime
    shouldCompareID &&
      contacts.map((contact) => {
        if (contact.id === parseInt(inp1)) {
          Swal.showValidationMessage(
            `A person already with same id: ${contact.name}`
          );
        }
      });
  };

  // -- CREATE CONTACT

  // Create contact model. [Do not transfrorm this code to async await it wont work]
  const fireFields = (
    title,
    details,
    confirmText,
    grammar,
    shoudlSubmit,
    shouldCompareID
  ) => {
    Swal.fire({
      title: title,
      html:
        `<input type="number" id="swal-input1" class="swal2-input" value="${details[0].id}" placeholder="Id">` +
        `<input type="text" id="swal-input2" class="swal2-input" value="${details[0].name}" placeholder="Name">`,
      focusConfirm: false,
      showCloseButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: confirmText,
      preConfirm: () => {
        let inp1 = document.getElementById("swal-input1").value;
        let inp2 = document.getElementById("swal-input2").value;

        Validations(inp1, inp2, shouldCompareID);
        return [inp1, inp2];
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // If confirmed and value filled create contact
        Toast.fire({
          icon: "success",
          title: `Contact ${result.value[1]} ${grammar} successfully!`,
        });
        shoudlSubmit && handleSubmit(result.value);
        !shoudlSubmit && handleUpdate(result.value);
      }
    });
  };

  // Toast here
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  // -- CONTACT GROUP

  // genrating whole div via iterating contacts list to append under htmlDiv section at line 87
  let ContactList = contacts.map((contact, index) => {
    let List = document.createElement("div");

    let input = document.createElement("input");
    input.type = "checkbox";
    input.value = contact.name;
    input.id = `checkbox${index}`;

    let label = document.createElement("label");
    label.setAttribute("for", `checkbox${index}`);
    label.textContent = contact.name;

    List.classList.add(
      "flex",
      "w-1/2",
      "pl-4",
      "border",
      "border-gray-400",
      "rounded",
      "m-auto",
      "my-2"
    );

    input.classList.add(
      "w-4",
      "h-4",
      "m-auto",
      "text-[#202020]",
      "bg-gray-100",
      "border-gray-300",
      "rounded",
      "focus:ring-blue-500",
      "focus:ring-1"
    );

    label.classList.add(
      "w-full",
      "py-4",
      "text-xl",
      "font-medium",
      "text-[#202020]",
      "uppercase"
    );

    List.appendChild(input);
    List.appendChild(label);

    return List.outerHTML;
  });

  // -- Conversaton model here [Create group]
  const CreateConvoModel = async () => {
    // Return if no contacts
    if (contacts.length === 0) {
      Toast.fire({
        icon: "error",
        title: "No Contacts!",
      });
      return;
    }

    const { value: accept } = await Swal.fire({
      title: "Create Conversation",
      showCloseButton: true,
      showCancelButton: true,
      cancelButtonText: "Discard Changes",
      html: ContactList.toString().replace(/,/g, ""),
      preConfirm: () => {
        let Fields = contacts.map((contact, index) => {
          return document.getElementById(`checkbox${index}`);
        });

        // counter variable
        let groupEligiblity = 0;

        // you bastard , dont try converting these to state variables. locally decalring for temproray use [array duration while function runtime].
        let groupMembers = [];

        // Cheking if min 3 members is cheked from list to create group
        Fields.forEach((elem, index) => {
          if (elem.checked === true) {
            groupMembers.push(elem.value);
            groupEligiblity++;
          }
        });

        let selectedContactIds = [];

        // getting contact details of selected group members
        for (let i = 0; i < groupMembers.length; i++) {
          for (let j = 0; j < contacts.length; j++) {
            if (groupMembers[i] === contacts[j].name) {
              selectedContactIds.push(contacts[j]);
            }
          }
        }

        console.log(selectedContactIds);
        createConversation(selectedContactIds);

        // Showing validation message for selection atleast 3
        if (groupEligiblity < 3) {
          Swal.showValidationMessage("Select atleast 3 to create group");
        }
      },
    });

    accept && Swal.fire("Group created Successfully!");
  };

  // -- EIDT CONTACT
  const EditContact = (contactDetail) => {
    // Getting contact details from contacts array to edit
    let clickedContact = contacts.filter((contact) => {
      return (
        contactDetail.textContent === contact.name &&
        parseInt(contactDetail.id.replace("elem-", "")) === contact.id
      );
    });

    // Calling same function with dynamic changes
    fireFields(
      "Edit Contact",
      clickedContact,
      "Save Changes",
      "details changed",
      false,
      false
    );
  };

  // -- DELETE CONTACT
  const DeleteContact = (contactDetail) => {
    // Getting contact details from contacts array to edit
    let clickedContact = contacts.filter((contact) => {
      return (
        contactDetail.textContent === contact.name &&
        parseInt(contactDetail.id.replace("elem-", "")) === contact.id
      );
    });
    console.log(clickedContact);

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, delete ${clickedContact[0].name}!`,
    }).then((result) => {
      if (result.isConfirmed) {
        handleChange(clickedContact);
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };
  return (
    <>
      <div
        className={`${style} h-96 w-full max-w-xl rounded-sm bg-[#202020] shadow-xl`}
      >
        <h2 className="text-center text-white">Contacts</h2>
        <div className="ml-10 mt-10">
          <h3 className="flex flex-row gap-2 text-white ">
            Your id:{" "}
            <span className="pointer-events-none rounded-sm bg-white p-1 text-sm text-[#202020]">
              {id}
            </span>{" "}
            <span className="mt-1 cursor-pointer text-2xl">
              <FaCopy
                onClick={() => {
                  navigator.clipboard.writeText(id);

                  Toast.fire({
                    icon: "success",
                    title: "Copied to Clipboad!",
                  });
                }}
              ></FaCopy>
            </span>
          </h3>

          {/* New contact button */}
          <button
            type="submit"
            className="m-3 w-fit border-2 bg-[#202020] px-4 py-2 text-white"
            onClick={() =>
              fireFields(
                "Create Contact",
                [{ id: "", name: "" }],
                "Create",
                "created",
                true,
                true
              )
            } // 2nd arg 'details' object set to empty
          >
            Create A new contact
          </button>

          {/* Create group */}
          <button
            type="submit"
            className="m-3 w-fit rounded-full border-2 bg-[#202020] p-3 text-white "
            onClick={() => CreateConvoModel()}
          >
            <AiOutlineUsergroupAdd className="text-2xl" />
          </button>
        </div>

        {/* Contacts list */}
        <ul class="mt-2 flex w-full flex-col">
          {contacts.map((contact) => {
            return (
              <li
                key={contact.id}
                class={`-mt-px inline-flex cursor-pointer items-center gap-x-2 border bg-white px-4 py-3 text-sm font-medium text-gray-800 first:mt-0 first:rounded-t-lg last:rounded-b-lg dark:border-white dark:bg-[#202020] dark:text-white`}
                id={`elem-${contact.id}`} // Adding prefix elem- to avoid queryselector error
              >
                {contact.name}
                <div className="ml-auto flex flex-row gap-2 text-xl">
                  <button>
                    <BiMessageAltDetail />
                  </button>
                  <div
                    onClick={() =>
                      EditContact(document.getElementById(`elem-${contact.id}`))
                    }
                  >
                    <BiEdit />
                  </div>
                  <div
                    onClick={() =>
                      DeleteContact(
                        document.getElementById(`elem-${contact.id}`)
                      )
                    }
                  >
                    <MdOutlineDeleteOutline />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default Contacts;
