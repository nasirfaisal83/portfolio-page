import type { NextConfig } from "next";

// Canonical site URL resolution (R14.4).
// Priority: explicit NEXT_PUBLIC_SITE_URL > Vercel-provided URL > localhost fallback.
// A missing value warns rather than fails the build so deploys are not blocked;
// SEO tags will use the resolved value.
const explicitUrl = process.env.NEXT_PUBLIC_SITE_URL;
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;

if (!explicitUrl) {
  if (vercelUrl) {
    // Surface the Vercel URL to the app as the canonical host.
    process.env.NEXT_PUBLIC_SITE_URL = `https://${vercelUrl}`;
    console.warn(
      `[next.config] NEXT_PUBLIC_SITE_URL not set; falling back to Vercel URL https://${vercelUrl}. ` +
        `Set NEXT_PUBLIC_SITE_URL explicitly to pin the canonical host.`
    );
  } else {
    console.warn(
      "[next.config] NEXT_PUBLIC_SITE_URL is not set and no Vercel URL is available. " +
        "SEO canonical/sitemap/OG URLs will fall back to http://localhost:3000. " +
        "Set NEXT_PUBLIC_SITE_URL to the canonical site URL before a real production deploy."
    );
  }
}

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
