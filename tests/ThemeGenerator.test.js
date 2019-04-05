import { ThemeGenerator } from '../src/theme'
import chroma from 'chroma-js'

describe('ThemeGenerator', () => {
  it('construct ThemeGenerator', () => {
    expect(new ThemeGenerator() instanceof ThemeGenerator)
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
    const themegen = new ThemeGenerator(newPalette)
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
    const themegen = new ThemeGenerator(palette)
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
        info: 'blue',
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
        info: 'blue',
      }
    }
    const themegen = new ThemeGenerator(p)
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
    let brighten = theme.palette.primary.brighten(.3)
    expect(typeof brighten).toEqual('string')
  })
})
