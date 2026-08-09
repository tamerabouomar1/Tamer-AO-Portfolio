import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AtlasSite from "./AtlasSite";
import "./reset.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AtlasSite />
  </StrictMode>
);
