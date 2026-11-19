import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  server: {
    proxy: {
      "/chat-api": {
        target: "https://unhaine-chat-api.ultrasaram.workers.dev",
        changeOrigin: true,
        headers: { Origin: "https://unhaine.com" },
        rewrite: (path) => path.replace(/^\/chat-api/, ""),
      },
    },
  },
});
