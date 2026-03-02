import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@atoms": path.resolve(__dirname, "./src/atoms"),
      "@layouts": path.resolve(__dirname, "./src/layouts"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@settings": path.resolve(__dirname, "./src/pages/Settings"),
      "@shared": path.resolve(__dirname, "./src/shared"),
      "@hooks": path.resolve(__dirname, "./src/shared/hooks"),
      "@components": path.resolve(__dirname, "./src/shared/components"),
      "@utils": path.resolve(__dirname, "./src/shared/utils"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./setupTests.js",
    coverage: {
      provider: "c8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "dist/", "tests/"],
    },
    ui: true,
  },
});
