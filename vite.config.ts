import { defineConfig } from "vite"
import path from "path";

export default defineConfig({
    root: path.join(import.meta.dirname, "src", "web", "public"),
    build: {
        outDir: path.join(import.meta.dirname, "dist", "web", "public"),
        emptyOutDir: true,
    }
});

