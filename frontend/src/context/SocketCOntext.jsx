import React, { createContext, useEffect, useState, useContext } from "react";
import { io } from "socket.io-client";
import { userDataContext } from "./UserContext";

export const socketDataContext = createContext(null);

const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { userData } = useContext(userDataContext);

  useEffect(() => {
    // try to get userId either from userData or from localStorage (adjust by your auth)
    const userId = userData?.id || userData?._id || localStorage.getItem("userId") || null;

    const newSocket = io("http://localhost:5000", {
      withCredentials: true,
      transports: ["websocket"],
      auth: { userId }, // recommended modern way
      query: { userId }, // fallback
    });

    setSocket(newSocket);

    newSocket.on("connect", () => console.log("Socket connected:", newSocket.id));
    newSocket.on("disconnect", () => console.log("Socket disconnected"));

    return () => newSocket.disconnect();
  }, [userData]);

  return <socketDataContext.Provider value={socket}>{children}</socketDataContext.Provider>;
};

export default SocketContextProvider;
