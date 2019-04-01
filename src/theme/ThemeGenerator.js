import chroma from 'chroma-js'

export default class ThemeGenerator {
  constructor (palettes) {
    this.palettes = {
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

    this.commonPalette = {
      colorTypes: Object.keys(this.palettes.light),
      greyscale: (v) => {
        let f = chroma.scale()
        return f(v).hex()
      }
    }

    this.shades = 5

    if (palettes) {
      this.addPalettes(palettes)
    }
  }

  generateTheme () {
    let theme = {}
    for (let themeName in this.palettes) {
      if (this.palettes.hasOwnProperty(themeName)) {
        theme[themeName] = {
          name: themeName,
          palette: {
            ...this.generatePalette(this.palettes[themeName]),
            ...this.commonPalette
          }
        }
      }
    }
    return theme
  }

  getTheme (name) {
    const theme = this.generateTheme()
    if (name) {
      return theme[name]
    }
    return theme
  }

  updatePalette (name, type, color) {
    this.palettes[name][type] = color
  }

  addPalettes (palettes) {
    for (let name in palettes) {
      if (palettes.hasOwnProperty(name)) {
        // todo:: check if palette has all fields needed, if not use default color
        this.palettes[name] = palettes[name]
      }
    }
  }

  getPalette (name) {
    return this.palettes[name] || {}
  }

  getPalettes () {
    return this.palettes
  }

  generatePalette = (palette, shades = this.shades) => {
    let tmpObj = {}
    for (let type in palette) {
      if (palette.hasOwnProperty(type)) {
        const color = palette[type]
        tmpObj[type] = {
          main: color,
          sat: this.saturate(color, shades),
          desat: this.desaturate(color, shades),
          bright: this.brighten(color, shades),
          dark: this.darken(color, shades),
          brighten: (v) => chroma(color).brighten(v),
          darken: (v) => chroma(color).darken(v),
          saturate: (v) => chroma(color).darken(v),
          desaturate: (v) => chroma(color).desaturate(v)
        }
      }
    }
    return tmpObj
  }

  saturate = (color, shades = this.shades) => {
    let arr = []
    for (let i = 0; i < shades; i++) {
      arr.push(chroma(color).saturate(i).hex())
    }
    return arr
  }

  desaturate = (color, shades = this.shades) => {
    let arr = []
    for (let i = 0; i < shades; i++) {
      arr.push(chroma(color).desaturate(i).hex())
    }
    return arr
  }

  darken = (color, shades = this.shades) => {
    let arr = []
    for (let i = 0; i < shades; i++) {
      arr.push(chroma(color).darken(i).hex())
    }
    return arr
  }

  brighten = (color, shades = this.shades) => {
    let arr = []
    for (let i = 0; i < shades; i++) {
      arr.push(chroma(color).brighten(i).hex())
    }
    return arr
  }

  getShades () {
    return this.shades
  }

  setShades (n) {
    if (typeof n !== 'number' || n <= 0) {
      throw new Error('shades must be of type number > 0')
    }
    this.shades = n
  }
}
