/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customBrown: "#805C47",
        baseColor: "#6C7275"
      },
      fontFamily: {
        aboreto: ['Aboreto', 'cursive'],
        vitenam: [ 'Be Vietnam Pro', 'sans-serif'],
        istok: ['Istok Web', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}