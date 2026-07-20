/**
 * Central API base URL for all axios requests.
 * Uses NEXT_PUBLIC_API_URL env var in production (Vercel),
 * falls back to localhost:5000 for local dev.
 */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default API_BASE_URL;
