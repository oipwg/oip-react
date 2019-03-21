import chroma from 'chroma-js'

const theme = (type = 'light', customTheme) => {
  const light = type === 'light'
  const dark = type === 'dark'
  const baseTheme = {
    palette: {
      primary: {
        main: ''
      },
      secondary: {},
      tertiary: {},
      background: {},
      x: (x) => x,
    },
    typography: {
      fontFamily: [].join(','),
      fontSize: {
        sm: 12,
        md: 14,
        lg: 18,
        x: (x) => x
      }
    },
    spacing: {}
  }
  if (customTheme) {
    for ()
  }
  return customTheme ? {...baseTheme, ...customTheme}
  
}
const LightTheme = theme('light')
const DarkTheme = theme('dark')
export {
  theme as Theme,
  LightTheme,
  DarkTheme
}
