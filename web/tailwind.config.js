const sharedConfig = require("tailwind-config-custom/tailwind.config.js");

module.exports = {
  content: {
    relative: true,
    files: ["./public/**/*.html", "./app/**/*.{js,ts,jsx,tsx}"],
  },
  presets: [sharedConfig],
  theme: {
    extend: {
      colors: {
        servcy: "#4D7E3E",
        "servcy-green": "#032123",
        "servcy-dark": "#26542F",
        "servcy-light": "#5BA959",
        "servcy-gray": "#DFE0EC",
        "servcy-silver": "#7E84A3",
        "servcy-white": "#F7F6FA",
        "servcy-black": "#2B3232",
        "servcy-cream": "#F1F2EF",
        "servcy-neutral": "#7A7A7A",
        "servcy-wheat": "#D1BFAE",
      },
    },
    darkMode: "class",
  }
};