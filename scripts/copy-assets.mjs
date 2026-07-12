import { copyFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";

const assets = [
    ["public/arabic-mathjax.css", "dist/arabic-mathjax.css"],
];

await Promise.all(
    assets.map(async ([from, to]) => {
        await mkdir(dirname(to), { recursive: true });
        await copyFile(from, to);
    }),
);
