/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
theme: {
    fontFamily: {
      'plus-jakarta-sans': ['"Plus Jakarta Sans"', 'sans'],
    },
    extend: {},
  },
  variants: {},
  plugins: [],
};