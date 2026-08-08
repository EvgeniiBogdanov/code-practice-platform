import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/frontend-practice/",
  plugins: [react()],
  server: {
    port: 4000,
    open: true,
  },
});
