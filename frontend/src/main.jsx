import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import UserContext from "./context/UserContext.jsx";
import CheckinContext from "./context/CheckinContext.jsx";
import SocketContextProvider from "./context/SocketCOntext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <UserContext>
         <CheckinContext>
           <SocketContextProvider>
            <App />
           </SocketContextProvider>
        </CheckinContext>
    </UserContext>
  </BrowserRouter>
);
