import React, {useState, useEffect, useRef} from "react";
import {v4 as uuidV4} from 'uuid'

const ChatAuth = ({style, onIdSubmit}) => {

    const idRef = useRef();

    const handleSubmit = (e) => {
        e.preventDefault();
        onIdSubmit(idRef.current.value);
    }

    const createNewId = () => {
        onIdSubmit(uuidV4);
    }
  return (
    <div
      className={`${style} h-96 w-full max-w-xl rounded-sm bg-[#202020] shadow-xl`}
    >
      <h2 className="text-center text-white">JOIN/Create a group</h2>
      <div className="mt-10 ml-10">
        <input
          className="flex h-10 w-1/2 items-center rounded bg-white px-3 text-sm text-[#202020]"
          type="text"
          placeholder="Enter Your Id" ref={idRef}
        />
        <button
          type="submit"
          className="m-3 w-fit border-2 bg-[#202020] px-4 py-2 text-white"
          onClick={createNewId}
          >
          Create A new id
        </button>
        <button
          type="submit"
          className="m-3 w-fit border-2 bg-[#202020] px-4 py-2 text-white"
          onClick={(e) => handleSubmit(e)}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default ChatAuth;
