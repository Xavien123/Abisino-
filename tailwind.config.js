// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        casino: {
          green: "#0a3a24",
          greenLight: "#125a3a",
          gold: "#D4AF37",
          goldMuted: "#B8992E",
          dark: "#121212",
          graphite: "#1e1e1e",
          danger: "#D32F2F"
        }
      },
      backgroundImage: {
        'felt-pattern': "url('/noise.png')" // Optional: Ein subtiles Noise-Overlay für die Tisch-Textur
      }
    },
  },
  plugins: [],
}
