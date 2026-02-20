/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Indian Fintech Theme (Deep Navy, Teal, Gold)
                navy: {
                    950: '#020617', // Deepest background
                    900: '#0F172A', // Main background (User requested)
                    800: '#1E293B', // Surface
                    700: '#334155', // Borders/Separators
                },
                teal: {
                    400: '#2DD4BF', // Success / Positive
                    500: '#14B8A6', // Primary Brand
                    600: '#0D9488', // Darker Brand
                },
                rose: {
                    500: '#F43F5E', // Expense / Negative
                },
                gold: {
                    400: '#FACC15', // Premium / Savings
                },
                text: {
                    primary: '#F8FAFC',
                    secondary: '#94A3B8',
                    muted: '#64748B',
                }
            },
            fontFamily: {
                sans: ['Inter', 'DM Sans', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            boxShadow: {
                'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                'glow': '0 0 15px rgba(20, 184, 166, 0.3)',
            }
        },
    },
    plugins: [],
}
