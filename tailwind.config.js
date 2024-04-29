/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

// TODO Font Family

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        theme: colors.sky,
        primary: colors.sky[600],
        secondary: colors.sky[400],
        'panel-white': colorWithOpacity(colors.white, 0.85),
      },
      boxShadow: {
        panel: `0 10px 60px 10px ${colorWithOpacity(colors.gray[800], 0.1)}`,
      },
      animation: {
        'icon-animate': 'icon-animate 1.33s ease-in-out infinite',
      },
    },
  },
};

function colorWithOpacity(color, opacity) {
  const hexColor =
    color.length === 4
      ? color
          .slice(1)
          .split('')
          .map((c) => c + c)
          .join('')
      : color.slice(1);
  const r = parseInt(hexColor.slice(0, 2), 16);
  const g = parseInt(hexColor.slice(2, 4), 16);
  const b = parseInt(hexColor.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
