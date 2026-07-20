/**
 * Central API base URL for all axios requests.
 * Uses an empty string so requests hit the local Next.js proxy (/api/*)
 * Next.js will rewrite them to the backend API automatically.
 */
const API_BASE_URL = "";


export default API_BASE_URL;
