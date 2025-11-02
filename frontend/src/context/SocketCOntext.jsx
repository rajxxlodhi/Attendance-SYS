
// import React, { createContext, useContext, useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import { userDataContext } from "./UserContext";

// export const socketDataContext = createContext();

// function SocketCOntext({ children }) {
//     const { userData } = useContext(userDataContext);
//   const [socket, setSocket] = useState(null);
//   const [onlineUsers, setOnlineUsers] = useState([]);

//     const connectSocket = () => {
//     if (userData?._id) {
//       const newSocket = io("http://localhost:5000", {
//         query: { userId: userData._id },
//         transports: ["websocket"],
//       });

//       newSocket.on("connect", () => {
//         console.log("✅ Socket connected:", newSocket.id);
//       });

//       newSocket.on("getOnlineUsers", (users) => {
//         console.log("🟢 Online Users:", users);
//         setOnlineUsers(users);
//       });

//       setSocket(newSocket);

//       // Cleanup on disconnect
//       return () => {
//         newSocket.disconnect();
//         console.log("❌ Socket disconnected");
//       };
//     }
//   };

//   useEffect(() => {
//     const cleanup = connectSocket();
//     return () => {
//       if (cleanup) cleanup();
//     };
//   }, [userData]);


//     let value = {
//     socket,
//     onlineUsers,
//   };

//   return (
//     <socketDataContext.Provider value={value}>

//     </socketDataContext.Provider>
//   )
// }

// export default SocketCOntext