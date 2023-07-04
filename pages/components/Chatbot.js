import { v4 as uuidv4 } from 'uuid';
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2'

const Chatbot = () => {
    const arrOfMessages = ["CYour Name?", "", "C", "Yeah Of-Course", "CHere's my room id: ", "CYeah it's copied to clipboard", "Let's go..."];

    const sendMessage = (message) => {
        console.log(message)
        const Replies = document.getElementById('Replies');
        const div = document.createElement('div');

        if (message.charAt(0) === 'C') {
            div.classList.add('flex', 'flex-col', 'items-start');
            message = message.replace("C","")
        }
        else {
            div.classList.add('flex', 'flex-col', 'items-end');
        }

        const Elem = document.createElement('p');
        const textNode = document.createTextNode(message);
        Elem.appendChild(textNode);
        Elem.classList.add('w-fit', 'text-[#202020]', 'text-sm', 'm-2', 'p-2', 'bg-[#E4E4E4]', 'rounded-sm');
        div.appendChild(Elem);
        Replies.appendChild(div);
    }

    // Sweet alert fire funciton [No html needed]
    const fireName = async () => {
        //HERE
        const { value: name } = await Swal.fire({
            title: 'Kimi no nawa',
            input: 'text',
            inputLabel: 'Your Name',
            inputPlaceholder: 'Enter your name'
        })
        if (name) {
            let confirmation = (await Swal.fire(`Entered name: ${name}`)).isConfirmed

            // Notification system
            if (confirmation) {
                arrOfMessages[1] = `The name's ${name}`;
                // HERE
                sendMessage(arrOfMessages[1]);

                toast(`${name} wana watch a short movie ?`, {
                    icon: "🔔",
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                arrOfMessages[2] = `C${name} wana watch a short movie`;
                // HERE
                setTimeout(()=>{
                    sendMessage(arrOfMessages[[2]]);
                }, 2000)
                setTimeout(() => {
                    further();
                }, 2300)
            }
        }
    }

    // Events after user agress to watch short movie !
    const further = async () => {
        Swal.fire({
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, lets go'
        }).then((result) => {
            if (result.isConfirmed) {
                // HERE
                sendMessage(arrOfMessages[3])
                // functino genrated random id
                let id = uuidv4();
                toast(`here's my room id: ${id}`, {
                    icon: "🔔",
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                //HERE
                sendMessage(arrOfMessages[4])

                // copying text to clipboard of user
                navigator.clipboard.writeText(id);
                //HERE
                setTimeout(()=>{
                    sendMessage(arrOfMessages[5])
                }, 2000)
                setTimeout(() => {
                    Swal.fire({
                        text: 'ID copied to clipboard !',
                        toast: true,
                        position: 'bottom'
                    }).then(async () => {
                        const enterdId = await Swal.fire({
                            icon: 'info',
                            title: 'You owe me smth...',
                            input: 'text',
                            inputLabel: 'Ctrl + V / paste',
                            inputPlaceholder: 'ID'
                        }).then(async () => {
                            //HERE
                            sendMessage(arrOfMessages[6])
                            console.log(arrOfMessages);
                        })
                    })
                }, 3000)
            }
        })
    }

    return (
        <>
            <ToastContainer
                position="bottom-center"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <div className="w-1/4 h-[25rem] cursor-pointer transition-all shadow-white-glow shadow-white/30 mt-10 mx-10 bg-[#202020] rounded-md">
                <p onMouseEnter={fireName} className="inline-block text-[#202020] text-sm m-3 p-3 bg-[#E4E4E4] rounded-sm" id="">INVICTUS - Bot here !</p>

                <div className='flex flex-col ' id='Replies'>
                </div>
            </div>
        </>
    )
}

export default Chatbot