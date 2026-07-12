import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    build: {
        emptyOutDir: false,
        lib: {
            entry: {
                "arabic-mathjax": path.resolve(__dirname, "src/lib/arabic-mathjax.ts"),
                browser: path.resolve(__dirname, "src/lib/browser.ts"),
            },
            formats: ["es", "cjs"],
            fileName: (format, entryName) => {
                const ext = format === "es" ? "js" : "cjs";
                return `${entryName}.${ext}`;
            },
        },
        rollupOptions: {
            external: [],
            output: {
                exports: "named",
            },
        },
    },
});
