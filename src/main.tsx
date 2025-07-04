import React from "react";
import ReactDOM from "react-dom/client";
import HomePage from "./pages/HomePage";
import "./styles/tailwind.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <HomePage />
  </React.StrictMode>,
);
