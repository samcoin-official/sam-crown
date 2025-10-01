import { createRoot } from "react-dom/client";
import { MiniKitProvider } from "@worldcoin/minikit-js/minikit-provider";
import { SessionProvider } from "next-auth/react";

import App from "./App";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find the root element");
}

createRoot(rootElement).render(
  <MiniKitProvider>
    <SessionProvider>
      <App />
    </SessionProvider>
  </MiniKitProvider>,
);
