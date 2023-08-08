/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  daisyui: {
    themes: [
      {
        'shaka-light': {
          primary: '#CAB9A7',
          secondary: '#EBECE6',
          accent: '#F4CCC0',
          neutral: '#f5f5f5',
          'base-100': '#fff',
          info: '#FFB6C1',
          success: '#36d399',
          warning: '#fbbd23',
          error: '#f87272',
        },
      },
      'light',
      'dark',
      'luxury',
      'night',
      'bumblebee',
    ],
  },
  plugins: [require('daisyui')],
};

// /* Main Color */
// $primary: #CAB9A7;

// /* Background Colors */
// $bg-primary: #F5F5F5;
// $bg-secondary: #FFFFFF;

// /* Text Colors */
// $text-primary: #000000;
// $text-secondary: #6C6C6C;
// $text-tertiary: #FFFFFF;

// /* Accent Colors */
// $accent-primary: #FFD700;
// $accent-secondary: #FFB6C1;
