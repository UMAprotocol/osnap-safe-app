import { Config } from "tailwindcss";
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      black: "hsl(var(--color-black) / <alpha-value>)",
      white: "hsl(var(--color-white) / <alpha-value>)",
      "gray-25": "hsl(var(--color-gray-25) / <alpha-value>)",
      "gray-50": "hsl(var(--color-gray-50) / <alpha-value>)",
      "gray-100": "hsl(var(--color-gray-100) / <alpha-value>)",
      "gray-200": "hsl(var(--color-gray-200) / <alpha-value>)",
      "gray-300": "hsl(var(--color-gray-300) / <alpha-value>)",
      "gray-400": "hsl(var(--color-gray-400) / <alpha-value>)",
      "gray-500": "hsl(var(--color-gray-500) / <alpha-value>)",
      "gray-600": "hsl(var(--color-gray-600) / <alpha-value>)",
      "gray-700": "hsl(var(--color-gray-700) / <alpha-value>)",
      "gray-800": "hsl(var(--color-gray-800) / <alpha-value>)",
      "gray-900": "hsl(var(--color-gray-900) / <alpha-value>)",
      "gray-950": "hsl(var(--color-gray-950) / <alpha-value>)",
      "primary-25": "hsl(var(--color-primary-25) / <alpha-value>)",
      "primary-50": "hsl(var(--color-primary-50) / <alpha-value>)",
      "primary-100": "hsl(var(--color-primary-100) / <alpha-value>)",
      "primary-200": "hsl(var(--color-primary-200) / <alpha-value>)",
      "primary-300": "hsl(var(--color-primary-300) / <alpha-value>)",
      "primary-400": "hsl(var(--color-primary-400) / <alpha-value>)",
      "primary-600": "hsl(var(--color-primary-600) / <alpha-value>)",
      "primary-700": "hsl(var(--color-primary-700) / <alpha-value>)",
      "primary-800": "hsl(var(--color-primary-800) / <alpha-value>)",
      "primary-900": "hsl(var(--color-primary-900) / <alpha-value>)",
      "primary-950": "hsl(var(--color-primary-950) / <alpha-value>)",
      "error-25": "hsl(var(--color-error-25) / <alpha-value>)",
      "error-50": "hsl(var(--color-error-50) / <alpha-value>)",
      "error-100": "hsl(var(--color-error-100) / <alpha-value>)",
      "error-200": "hsl(var(--color-error-200) / <alpha-value>)",
      "error-300": "hsl(var(--color-error-300) / <alpha-value>)",
      "error-400": "hsl(var(--color-error-400) / <alpha-value>)",
      "error-500": "hsl(var(--color-error-500) / <alpha-value>)",
      "error-600": "hsl(var(--color-error-600) / <alpha-value>)",
      "error-700": "hsl(var(--color-error-700) / <alpha-value>)",
      "error-800": "hsl(var(--color-error-800) / <alpha-value>)",
      "error-900": "hsl(var(--color-error-900) / <alpha-value>)",
      "error-950": "hsl(var(--color-error-950) / <alpha-value>)",
      "warning-25": "hsl(var(--color-warning-25) / <alpha-value>)",
      "warning-50": "hsl(var(--color-warning-50) / <alpha-value>)",
      "warning-100": "hsl(var(--color-warning-100) / <alpha-value>)",
      "warning-200": "hsl(var(--color-warning-200) / <alpha-value>)",
      "warning-300": "hsl(var(--color-warning-300) / <alpha-value>)",
      "warning-400": "hsl(var(--color-warning-400) / <alpha-value>)",
      "warning-500": "hsl(var(--color-warning-500) / <alpha-value>)",
      "warning-600": "hsl(var(--color-warning-600) / <alpha-value>)",
      "warning-700": "hsl(var(--color-warning-700) / <alpha-value>)",
      "warning-800": "hsl(var(--color-warning-800) / <alpha-value>)",
      "warning-900": "hsl(var(--color-warning-900) / <alpha-value>)",
      "success-25": "hsl(var(--color-success-25) / <alpha-value>)",
      "success-50": "hsl(var(--color-success-50) / <alpha-value>)",
      "success-100": "hsl(var(--color-success-100) / <alpha-value>)",
      "success-200": "hsl(var(--color-success-200) / <alpha-value>)",
      "success-300": "hsl(var(--color-success-300) / <alpha-value>)",
      "success-400": "hsl(var(--color-success-400) / <alpha-value>)",
      "success-500": "hsl(var(--color-success-500) / <alpha-value>)",
      "success-600": "hsl(var(--color-success-600) / <alpha-value>)",
      "success-700": "hsl(var(--color-success-700) / <alpha-value>)",
      "success-800": "hsl(var(--color-success-800) / <alpha-value>)",
      "success-900": "hsl(var(--color-success-900) / <alpha-value>)",
    },
    extend: {},
  },
  plugins: [],
} satisfies Config;
