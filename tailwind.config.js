/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: 'var(--canvas-bg)',
          subtle: 'var(--canvas-subtle)',
          elevated: 'var(--canvas-elevated)',
        },
        line: {
          hairline: 'var(--line-hairline)',
          subtle: 'var(--line-subtle)',
          strong: 'var(--line-strong)',
        },
        ink: {
          primary: 'var(--ink-primary)',
          secondary: 'var(--ink-secondary)',
          muted: 'var(--ink-muted)',
          inverted: 'var(--ink-inverted)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          subtle: 'var(--accent-subtle)',
        },
        alert: {
          error: 'var(--alert-error)',
          warn: 'var(--alert-warn)',
          ok: 'var(--alert-ok)',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Menlo', 'monospace'],
      }
    },
  },
  plugins: [],
}
