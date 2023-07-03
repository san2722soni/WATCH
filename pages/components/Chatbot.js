import { v4 as uuidv4 } from 'uuid';
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2'

const Chatbot = () => {

    // Sweet alert fire funciton [No html needed]
    const fireName = async () => {

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

                // copying text to clipboard of user
                navigator.clipboard.writeText(id);
                setTimeout(() => {
                    Swal.fire({
                        text: 'ID copied to clipboard !',
                        toast: true,
                        position: 'bottom'
                    }).then(async () => {
                        const { value: id } = await Swal.fire({
                            icon: 'info',
                            title: 'You owe me smth...',
                            input: 'text',
                            inputLabel: 'Ctrl + V / paste',
                            inputPlaceholder: 'ID'
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
            <h1>Chat bot here</h1>
            <div className='flex justify-center'>
            <button onClick={fireName} className="inline-flex text-white bg-indigo-500 border-0 py-1 px-4 focus:outline-none hover:bg-indigo-600 rounded">Start</button>
            </div>
        </>
    )
}

export default Chatbot