import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Load global normalize FIRST
import "./styles/global.css";

// Then your existing base/index styles (optional if merged into global.css)
import "./index.css";

import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
