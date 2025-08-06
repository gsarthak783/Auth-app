/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#3b82f6",
          "primary-focus": "#2563eb",
          "primary-content": "#ffffff",
          
          "secondary": "#6366f1",
          "secondary-focus": "#4f46e5",
          "secondary-content": "#ffffff",
          
          "accent": "#f59e0b",
          "accent-focus": "#d97706",
          "accent-content": "#ffffff",
          
          "neutral": "#374151",
          "neutral-focus": "#1f2937",
          "neutral-content": "#ffffff",
          
          "base-100": "#ffffff",
          "base-200": "#f9fafb",
          "base-300": "#f3f4f6",
          "base-content": "#1f2937",
          
          "info": "#0ea5e9",
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
        dark: {
          "primary": "#3b82f6",
          "primary-focus": "#2563eb",
          "primary-content": "#ffffff",
          
          "secondary": "#6366f1",
          "secondary-focus": "#4f46e5",
          "secondary-content": "#ffffff",
          
          "accent": "#f59e0b",
          "accent-focus": "#d97706",
          "accent-content": "#ffffff",
          
          "neutral": "#1f2937",
          "neutral-focus": "#111827",
          "neutral-content": "#ffffff",
          
          "base-100": "#1f2937",
          "base-200": "#374151",
          "base-300": "#4b5563",
          "base-content": "#ffffff",
          
          "info": "#0ea5e9",
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
      },
    ],
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
    rtl: false,
    prefix: "",
    logs: true,
  },
}