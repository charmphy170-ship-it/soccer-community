import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1a5f2a",
        secondary: "#2d8a3e",
        accent: "#f4d03f",
        dark: "#0f172a",
        card: "#1e293b",
      },
    },
  },
  plugins: [],
};
export default config;
