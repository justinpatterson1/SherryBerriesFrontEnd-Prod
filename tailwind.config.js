/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        brand: {
          DEFAULT: '#EA4492',
          hover: '#c83778',
          light: '#ffefef'
        }
      },
      fontFamily: {
        sans: ['var(--font-playfair-display)', 'Georgia', 'Times New Roman', 'serif'],
        serif: ['var(--font-playfair-display)', 'Georgia', 'Times New Roman', 'serif'],
        display: ['var(--font-playfair-display)', 'Georgia', 'Times New Roman', 'serif']
      }
    }
  },
  plugins: []
};
