/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#14161A",
          800: "#1D2026",
          700: "#272B33",
        },
        accent: {
          DEFAULT: "#4F5DFF",
          dark: "#3B47D9",
          light: "#E8EAFF",
        },
        slate: {
          50: "#F7F8FA",
          100: "#EEF0F4",
        },
      },
      fontFamily: {
        display: ["'Sora'", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["'Inter'", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}

