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
      //local django, for development only. next/image refuses any host that
      //is not listed here, so without this every avatar and logo 400s when
      //NEXT_PUBLIC_API_URL points at localhost.
      { protocol: "http", hostname: "127.0.0.1", port: "8000" },
      { protocol: "http", hostname: "localhost", port: "8000" },
    ],
  },
};

export default nextConfig;
