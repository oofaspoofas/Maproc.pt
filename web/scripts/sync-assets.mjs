import { readFile, mkdir, copyFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const files = JSON.parse(
  await readFile(path.join(root, "lib/asset-policy.json"), "utf8"),
);
let bytesBefore = 0;
let bytesAfter = 0;
for (const file of files) {
  const input = path.join(root, "../data/assets", file);
  const output = path.join(
    root,
    "public/assets",
    file.replace(/\.(png|jpe?g)$/i, ".webp"),
  );
  await mkdir(path.dirname(output), { recursive: true });
  const source = await stat(input);
  bytesBefore += source.size;
  const existing = await stat(output).catch(() => null);
  if (!existing || existing.mtimeMs < source.mtimeMs) {
    if (file.endsWith(".svg")) await copyFile(input, output);
    else
      await sharp(input)
        .rotate()
        .resize({ width: 1800, withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(output);
  }
  bytesAfter += (await stat(output)).size;
}
console.log(
  `Synced ${files.length} approved assets: ${Math.round(bytesBefore / 1024)} KB → ${Math.round(bytesAfter / 1024)} KB.`,
);
