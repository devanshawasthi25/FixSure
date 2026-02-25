import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: '#0a5fdb',
        accent: '#0ea5a4'
      }
    }
  },
  plugins: []
};

export default config;
