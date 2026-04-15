import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react({
      babel: { plugins: ["babel-plugin-react-compiler"] },
    }),
    tailwindcss(),
    ...(process.env.ANALYZE === "true"
      ? [visualizer({ open: true, gzipSize: true, brotliSize: true })]
      : []),
  ],

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
      "@mocks": path.resolve(__dirname, "./src/mocks"),
    },
  },

  optimizeDeps: {
    include: ["react", "react-dom/client", "react-router-dom"],
  },

  test: {
    globals: true,
    // environment: "jsdom",
    environment: "happy-dom",
    setupFiles: "./setupTests.js",
    coverage: {
      provider: "c8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "dist/", "tests/"],
    },
    ui: true,
  },

  build: {
    target: "esnext",
    minify: "esbuild",
    cssMinify: true,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom/client"],
        },
      },
    },
  },
});
