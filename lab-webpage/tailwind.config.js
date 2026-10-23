/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        white: "rgb(255, 255, 255)",
        dark: "rgb(5, 5, 5)",
        border: "#d9dfe5",
        borderA: "rgb(5, 5, 5, 0.3)",
        title: "#1f3a56",
        my_name: "rgb(120 132 146)",
        participate: "#bf9000",
        steel: "#1f3a56",
        ink: "#14202b",
        paper: "#f4f6f8",
        ipfr: "#e2445c",
        ipfg: "#2fae6b",
        ipfb: "#3a63d8",
      },
      fontFamily: {
        sans: ['"IBM Plex Sans KR"', '"Apple SD Gothic Neo"', '"Malgun Gothic"', "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "Menlo", "Consolas", "monospace"],
      },
      backgroundImage: {
        "first-bg": "url('/public/images/main_img(1).jpg')",
        "second-bg": "url('/public/images/second_img(2).jpg')",
        "pandat-bg": "url('/public/images/pandat_고화질.png')",
      },
      keyframes: {
        gotoRight: {
          "0%": {
            transform: "translateX(0)",
            opacity: "0",
          },
          "100%": {
            transform: "translateX(100px)",
            opacity: "1",
          },
        },
        gotoDown: {
          "0%": {
            transform: "translateY(0)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(100px)",
            opacity: "1",
          },
        },
        gotoDownLow: {
          "0%": {
            transform: "translateY(0)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(50px)",
            opacity: "1",
          },
        },
        appear: {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        modalIn: {
          "0%": {
            opacity: "0",
            transform: "scale(0.95) translateY(-10px)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1) translateY(0)",
          },
        },
      },
      animation: {
        "fade-in": "appear 0.2s ease-out",
        "modal-in": "modalIn 0.3s ease-out",
      },
    },
  },
  plugins: [],
};
