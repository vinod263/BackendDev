import { Rss } from "lucide-react";
import { io } from "socket.io-client";

export const initializeSocketConnection = () => {
     const socket = io("http://localhost:3000 ||https://backenddev-0f71.onrender.com/", {
        withCredentials: true,
    })
    socket.on("connect", ()=>{
        console.log("Connected to Socket.IO server")
    })
    
}


