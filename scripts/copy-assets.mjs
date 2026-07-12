import { copyFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";

const assets = [
    ["public/mathjax4arabic.css", "dist/mathjax4arabic.css"],
];

await Promise.all(
    assets.map(async ([from, to]) => {
        await mkdir(dirname(to), { recursive: true });
        await copyFile(from, to);
    }),
);
