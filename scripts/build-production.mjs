import { spawnSync } from "node:child_process";
import { readdirSync, unlinkSync } from "node:fs";
import path from "node:path";
const option = process.argv.indexOf("--video-base");
const base =
  option >= 0 ? process.argv[option + 1] : process.env.VITE_VIDEO_BASE_URL;
if (base) {
  const url = new URL(base);
  if (url.protocol !== "https:") throw new Error("Video base must use HTTPS");
}
const result = spawnSync("npm", ["run", "build"], {
  stdio: "inherit",
  env: { ...process.env, ...(base ? { VITE_VIDEO_BASE_URL: base } : {}) },
});
if (result.status !== 0) process.exit(result.status || 1);
if (base) {
  for (const name of readdirSync("dist/media"))
    if (name.endsWith(".mp4")) unlinkSync(path.join("dist/media", name));
  console.log(
    "External MP4 delivery enabled. Local posters and authorized website music retained.",
  );
}
