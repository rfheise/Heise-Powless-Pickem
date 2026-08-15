import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  //emit .next/standalone with a self-contained server.js and only the
  //node_modules the app actually reaches
  output: "standalone",

  //v4/ holds several apps and more than one lockfile, so left alone next
  //guesses the workspace root and can trace from the wrong directory. pin it
  //to this app.
  outputFileTracingRoot: __dirname,

  images: {
    //profile pictures and team logos are served by the pickem backend
    remotePatterns: [
      {
        protocol: "https",
        hostname: "powless.heise.ai",
      },
    ],
  },
};

export default nextConfig;
