/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        alt: ['Space Grotesk', 'sans-serif'],
        mono: ['Fira Code', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        fancy: ['DM Serif Display', 'serif'],
        soft: ['Quicksand', 'sans-serif'],
        play: ['Fredoka', 'cursive'],
      },
    },
  },
  plugins: [],
}
