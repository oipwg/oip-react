import { ThemeGenerator } from '../src/theme'
import chroma from 'chroma-js'

describe('ThemeGenerator', () => {
  it('construct ThemeGenerator', () => {
    expect(new ThemeGenerator() instanceof ThemeGenerator)
  })
  it('generate theme', () => {
    let themegen = new ThemeGenerator()
    const theme = themegen.generateTheme()

    const lightTheme = theme['light']
    expect(lightTheme.spacing).toEqual({
      sm: [2, 4, 8, 10, 12],
      md: [20, 30, 40, 50, 60],
      lg: [75, 100, 150, 200, 250]
    })
    expect(lightTheme.breakpoints).toEqual({
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920
    })
    expect(lightTheme.shadows).toEqual([
      'none',
      '0px 1px 3px 0px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 2px 1px -1px rgba(0,0,0,0.12)',
      '0px 1px 5px 0px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 3px 1px -2px rgba(0,0,0,0.12)',
      '0px 1px 8px 0px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 3px 3px -2px rgba(0,0,0,0.12)',
      '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
      '0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)',
      '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
      '0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)',
      '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)',
      '0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)',
      '0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)',
      '0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)',
      '0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)',
      '0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)',
      '0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)',
      '0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)',
      '0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)',
      '0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)',
      '0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)',
      '0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)',
      '0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)',
      '0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)',
      '0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)',
      '0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)',
      '0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)'
    ])
  })
  it('get palettes', () => {
    const themegen = new ThemeGenerator()
    const palettes = {
      'light': {
        'primary': '#3688aa',
        'secondary': '#c45249',
        'tertiary': '#303c58',
        'background': '#ffffff',
        'text': '#000000',
        'success': '#339757',
        'warning': '#fcaa32',
        'danger': '#FF0000',
        'info': '#5d5d66'
      },
      'dark': {
        'primary': '#3688aa',
        'secondary': '#c45249',
        'tertiary': '#4f6391',
        'background': '#000000',
        'text': '#ffffff',
        'success': '#339757',
        'warning': '#ee9a26',
        'danger': '#FF0000',
        'info': '#74748d'
      }
    }
    expect(themegen.palettes).toEqual(palettes)
    expect(themegen.getPalettes()).toEqual(palettes)
    expect(themegen.getPalette('dark')).toEqual(palettes.dark)
    expect(themegen.getPalette('light')).toEqual(palettes.light)
  })
  it('from palettes', () => {
    const newPalette = {
      chroma: {
        primary: 'black',
        secondary: 'yellow',
        tertiary: 'white',
        background: 'gold',
        text: 'cyan',
        warning: 'orange',
        danger: 'maroon',
        info: 'purple'
      }
    }
    const themegen = new ThemeGenerator({ palettes: newPalette })
    expect(themegen.getPalette('chroma')).toBeDefined()
    expect(themegen.getPalette('chroma')).toEqual(newPalette.chroma)
  })
  it('from custom palette', () => {
    const palette = {
      'light': {
        'primary': '#394949',
        'secondary': '#1d1da2',
        'tertiary': '#74df74',
        'background': '#744f4f',
        'text': '#ff3838',
        'success': '#647964',
        'warning': '#9b907c',
        'danger': '#df5c5c',
        'info': '#4f4f91'
      },
      'dark': {
        'primary': '#383850',
        'secondary': '#8d8d56',
        'tertiary': '#d833d8',
        'background': '#967373',
        'text': '#af3636',
        'success': '#7cbd7c',
        'warning': '#f0ae35',
        'danger': '#ad8282',
        'info': '#19198f'
      }
    }
    const themegen = new ThemeGenerator({ palettes: palette })
    expect(themegen.getPalettes()).toEqual({
      light:
        {
          primary: '#394949',
          secondary: '#1d1da2',
          tertiary: '#74df74',
          background: '#744f4f',
          text: '#ff3838',
          success: '#647964',
          warning: '#9b907c',
          danger: '#df5c5c',
          info: '#4f4f91'
        },
      dark:
        {
          primary: '#383850',
          secondary: '#8d8d56',
          tertiary: '#d833d8',
          background: '#967373',
          text: '#af3636',
          success: '#7cbd7c',
          warning: '#f0ae35',
          danger: '#ad8282',
          info: '#19198f'
        }
    })
  })
  it('update palette colors', () => {
    const p = {
      light: {
        primary: 'teal',
        secondary: 'darkblue',
        tertiary: 'green',
        background: 'white',
        text: 'black',
        success: 'green',
        warning: 'orange',
        danger: 'red',
        info: 'blue'
      },
      dark: {
        primary: 'blue',
        secondary: 'yellow',
        tertiary: 'purple',
        background: 'black',
        text: 'white',
        success: 'green',
        warning: 'orange',
        danger: 'red',
        info: 'blue'
      }
    }
    const themegen = new ThemeGenerator({ palettes: p })
    let theme = themegen.getTheme()
    expect(theme.dark).toBeDefined()
    expect(theme.light).toBeDefined()
    expect(theme.light.palette.primary.main).toEqual('teal')
    themegen.updatePalette('light', 'primary', 'red')
    theme = themegen.getTheme()
    expect(theme.light.palette.primary.main).toEqual('red')
  })
  it('use chroma functions', () => {
    const themegen = new ThemeGenerator()
    let theme = themegen.getTheme('light')
    let brighten = theme.palette.primary.brighten(0.3)
    expect(typeof brighten).toEqual('string')
  })
})
