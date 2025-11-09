import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import AdminRoutes from  "./Admin";
import "./index.css"; // Tailwind base imported here

createRoot(document.getElementById("root")).render(<App />);
createRoot(document.getElementById("root")).render(<AdminRoutes />);
