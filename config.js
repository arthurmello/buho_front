// Import all env vars from .env file
require('dotenv').config()
export const VITE_BACK_API_URL = process.env.VITE_BACK_API_URL
console.log(VITE_BACK_API_URL)