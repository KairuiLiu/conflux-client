/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors'; // undefined

// TODO Font Family

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      theme: colors.sky,
      primary: colors.sky[600],
      secondary: colors.sky[400],
      danger: colors.red[500],
      avatarBackground: [
        ...['red', 'orange', 'amber', 'yellow', 'lime', 'green'],
        ...['emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo'],
        ...['violet', 'purple', 'fuchsia', 'pink', 'rose'],
      ].map((d) => colors[d][400]),
    },
    extend: {},
  },
  plugins: [],
};
