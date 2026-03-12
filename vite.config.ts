import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react-router")) {
              return "router";
            }

            if (id.includes("firebase")) {
              return "firebase";
            }

            if (id.includes("@fortawesome")) {
              return "fontawesome";
            }

            if (id.includes("react") || id.includes("react-dom")) {
              return "react-vendor";
            }

            return "vendor";
          }
        },
      },
    },
  },
});