/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#161622",
        secondary: {
          DEFAULT: "#FF9C01",
          100: "#FF9001",
          200: "#FF8E01",
        },
        black: {
          DEFAULT: "#000",
          100: "#1E1E2D",
          200: "#232533",
        },
        gray: {
          100: "#CDCDE0",
        },
      },
      fontFamily: {
        mPregular: ["MavenPro-Regular", "sans-serif"],
        mPmedium: ["MavenPro-Medium", "sans-serif"],
        mPsemibold: ["MavenPro-SemiBold", "sans-serif"],
        mPbold: ["MavenPro-Bold", "sans-serif"],
        mPextrabold: ["MavenPro-ExtraBold", "sans-serif"],
        mPblack: ["MavenPro-Black", "sans-serif"],
        jSregular: ["JosefinSans-Regular", "sans-serif"],
      },
    },
  },
  plugins: [],
};
