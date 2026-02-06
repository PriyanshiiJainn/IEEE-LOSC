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
        times: ['"Times New Roman"', "Times", "serif"], // ✅ Added Times New Roman
        sans: ["ui-sans-serif", "system-ui"], // Optional: default sans
      },
    },
  },
  plugins: [],
};

export default config;
