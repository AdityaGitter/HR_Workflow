/** @type {import('tailwindcss').Config} */
// Tailwind v4 uses CSS-first config via @theme in index.css.
// This file is kept for any tooling that reads it (e.g. editor plugins).
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
};