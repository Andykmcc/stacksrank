import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        scarlet: {
          50: '#fff3ec',
          100: '#ffe4d3',
          200: '#ffc6a5',
          300: '#ff9e6d',
          400: '#ff6932',
          500: '#ff420a',
          600: '#ff2600',
          700: '#cc1602',
          800: '#a1130b',
          900: '#82130c',
          950: '#460504',
        },
      }
    }
  }
}
