import type { NextConfig } from 'next';

/**
 * A deployed build with no `NEXT_PUBLIC_API_URL` falls back to `http://localhost:8080`, which means
 * every visitor's browser calls **their own machine**. It fails as a connection error, so the
 * visitor is told to check their internet because a build variable was missing.
 *
 * `NEXT_PUBLIC_*` is inlined at build time, so setting the variable on the host and redeploying
 * without a rebuild changes nothing — which is what makes the mistake so hard to see from the
 * outside. The only place it can be caught for certain is here, while the bundle is being made.
 *
 * Refused only when building on the hosting platform. A developer building locally still gets the
 * localhost default, which is the right thing for them.
 */
if (process.env.VERCEL && !process.env.NEXT_PUBLIC_API_URL?.trim()) {
  throw new Error(
    'NEXT_PUBLIC_API_URL is not set. A build without it points every visitor at their own machine, ' +
      'and the value is inlined now — setting it after this build will not help. Set it in the ' +
      'project environment and build again.'
  );
}

const nextConfig: NextConfig = {
  reactCompiler: true
};

export default nextConfig;
