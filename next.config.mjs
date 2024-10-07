/** @type {import('next').NextConfig} */
const nextConfig = {
    env:{
        NEXT_DATABASE_URL: process.env.NEXT_DATABASE_URL,
        NEXT_WEB3_AUTH_CLIENT_ID: process.env.NEXT_WEB3_AUTH_CLIENT_ID,
        NEXT_PUBLIC_GEMINI_API_KEY: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
        NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    }
};

export default nextConfig;
