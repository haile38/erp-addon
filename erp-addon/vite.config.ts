import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
 
export default defineConfig({
  plugins: [react()],
 
server: {
  proxy: {
    "/auth": {
      target: "https://imsnext-auth.enrichco.us",
      changeOrigin: true,
      secure: true,

      rewrite: (path) =>
        path.replace(
          /^\/auth/,
          "/api/authentication"
        ),
    },

    "/api": {
      target: "https://imsnext-portal.enrichco.us",
      changeOrigin: true,
      secure: true,
    },
  },
},
});
 