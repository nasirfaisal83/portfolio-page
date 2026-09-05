import type { NextConfig } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

if (process.env.NODE_ENV === "production" && !siteUrl) {
  throw new Error(
    "NEXT_PUBLIC_SITE_URL is not set. Set it to the canonical URL of the site (e.g. https://faisalnasir.dev) before building for production."
  );
}

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
