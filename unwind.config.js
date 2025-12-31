/** @type {import('uniwind').Config} */
module.exports = {
  content: ["./App.js", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#F59E0B",
        purpleBg: "#C2B5DF",
        dark: "#1A1A1A",
      },
      borderRadius: {
        card: "28px",
      },
    },
  },
};
