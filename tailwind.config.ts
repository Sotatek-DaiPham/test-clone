import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // fontFamily: {
      //   sfPro: ["var(--font-sf-pro)"],
      // },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          white: "var(--color-text-neon-primary)",
        },
      },
      width: {
        container: "1440px",
      },
      maxWidth: {
        container: "1440px",
      },
      boxShadow: {
        "custom-inset": "inset 0px -2px 0px 0px rgba(255, 255, 255, 0.2)",
      },
      fontSize: {
        "26px-bold": [
          "26px",
          {
            lineHeight: "32px",
            fontWeight: "700",
          },
        ],
        "22px-bold": [
          "22px",
          {
            lineHeight: "32px",
            fontWeight: "700",
          },
        ],
        "18px-bold": [
          "18px",
          {
            lineHeight: "24px",
            fontWeight: "700",
          },
        ],
        "14px-bold": [
          "14px",
          {
            lineHeight: "20px",
            fontWeight: "700",
          },
        ],
        "16px-bold": [
          "16px",
          {
            lineHeight: "24px",
            fontWeight: "700",
          },
        ],
        "16px-medium": [
          "16px",
          {
            lineHeight: "24px",
            fontWeight: "500",
          },
        ],
        "18px-medium": [
          "18px",
          {
            lineHeight: "24px",
            fontWeight: "500",
          },
        ],
        "14px-medium": [
          "14px",
          {
            lineHeight: "20px",
            fontWeight: "500",
          },
        ],
        "12px-medium": [
          "12px",
          {
            lineHeight: "16px",
            fontWeight: "500",
          },
        ],
        "26px-medium": [
          "26px",
          {
            lineHeight: "32px",
            fontWeight: "500",
          },
        ],
        "18px-normal": [
          "18px",
          {
            lineHeight: "24px",
            fontWeight: "400",
          },
        ],
        "16px-normal": [
          "16px",
          {
            lineHeight: "24px",
            fontWeight: "400",
          },
        ],
        "14px-normal": [
          "14px",
          {
            lineHeight: "21px",
            fontWeight: "400",
          },
        ],
      },
      screens: {
        "2xs": "0px",
        xs: "375px",
        sm: "640px",
        md: "768px",
        "2md": "896px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px",
      },
    },
  },
  plugins: [],
};
export default config;
