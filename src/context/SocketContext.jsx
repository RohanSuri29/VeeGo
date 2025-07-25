import { createContext, useEffect } from "react";
import { io } from "socket.io-client";

export const SocketProvider = createContext();

const socket = io('http://localhost:4000');

function SocketContext({children}) {

    useEffect(() => {

        socket.on('connect' , () => {
            console.log("Connected to server")
        })

        socket.on('disconnect' , () => {
            console.log('disconnected from server')
        })

    },[])

    const value = {socket};

    return (

        <SocketProvider.Provider value={value}>
            {children}
        </SocketProvider.Provider>

    )
}

export default SocketContext;