import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import UserContext from "./context/UserContext.jsx";
import CheckinContext from "./context/CheckinContext.jsx";
import SocketContextProvider from "./context/SocketContext.jsx";
import AddressContext from "./context/AddressContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <UserContext>
         <CheckinContext>
           <SocketContextProvider>
            <AddressContext>
            <App />
            </AddressContext>
           </SocketContextProvider>
        </CheckinContext>
    </UserContext>
  </BrowserRouter>
);
