import React, { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

export const socketDataContext = createContext(null);

const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:5000", {
      withCredentials: true,
      transports: ["websocket"],
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("🟢 Socket connected:", newSocket.id);
    });

    newSocket.on("disconnect", () => {
      console.log("🔴 Socket disconnected");
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return <socketDataContext.Provider value={socket}>{children}</socketDataContext.Provider>;
};

export default SocketContextProvider;
