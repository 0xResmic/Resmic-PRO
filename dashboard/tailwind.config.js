/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4f2c71", // Add your personal color
        secondary: "#f0f3fa", // Another custom color if needed
      },
    },
  },
  plugins: [],
}