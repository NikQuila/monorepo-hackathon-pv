/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
    "../common/src/**/*.{ts,tsx,js,jsx}",
  ],
plugins: ["tailwindcss-animate"],
}
