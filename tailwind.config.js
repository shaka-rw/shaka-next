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
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem !important',
        sm: '2rem !important',
        lg: '4rem !important',
        xl: '5rem !important',
        '2xl': '6rem !important',
      },
    }
  },
  daisyui: {
    themes: [
      {
        'shaka-light': {
          primary: '#CAB9A7',
          secondary: '#EEB87E',
          accent: '#F4CCC0',
          neutral: '#f5f5f5',
          'base-100': '#fff',
          info: '#FFB6C1',
          success: '#36d399',
          warning: '#fbbd23',
          error: '#f87272',
        },
        // 'shaka-dark': {
        //   primary: '#786557',
        //   secondary: '#B07842',
        //   accent: '#CC9E8B',
        //   neutral: '#333',
        //   'base-100': '#1E1E1E',
        //   info: '#FF6B7A',
        //   success: '#2E7D5A',
        //   warning: '#C68D1D',
        //   error: '#A63F3F',
        // },
        'shaka-dark': {
          primary: '#CAB9A7',
          secondary: '#EEB87E',
          accent: '#F4CCC0', //'#DAA776',
          neutral: '#1F2937',
          'base-100': '#111827',
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
