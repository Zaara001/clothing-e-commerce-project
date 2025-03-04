/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customBrown: "#C9A38D",
        baseColor: "#6C7275"
      },
      fontFamily: {
        aboreto: ['Aboreto', 'cursive']
      },
    },
  },
  plugins: [],
}