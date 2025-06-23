import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // serve from “/” when you run `npm run dev`, but from “/my-repo/” in your build
  base: command === "serve" ? "/" : "/geburtslotterie/",
}));
