import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ieee: {
          red: "#c41230",
          navy: "#0a1628",
          gray: "#4a4a4a",
        },
      },
      fontFamily: {
        times: ['"Times New Roman"', "Times", "serif", "georgia","garamond"],
        sans: ["ui-sans-serif", "system-ui"],
      },
    keyframes: {
  marqueeLeftToRight: {
    "0%": { transform: "translateX(-100%)" },  // Start fully off-screen left
    "100%": { transform: "translateX(100%)" }, // End fully off-screen right
  },
},
animation: {
  marqueeLeftToRight: "marqueeLeftToRight 10s linear infinite",
},


    },
  },
  plugins: [],
};

export default config;
