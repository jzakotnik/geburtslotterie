import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // if your GitHub repo is "government_forms":
  base: "/geburtslotterie/",
});
