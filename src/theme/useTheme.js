import { useRef, useState, useEffect } from 'react'
import ThemeGenerator from './ThemeGenerator'

const useTheme = (palettes) => {
  const refThemeGen = useRef(new ThemeGenerator(palettes)).current

  const [mode, setMode] = useState('light')
  const [theme, setTheme] = useState(() => refThemeGen.getTheme(mode))

  function changeTheme (mode) {
    if (!refThemeGen.getTheme(mode)) {
      console.error(`Theme does not contain theme of mode type: ${mode} -- defaulting to light theme`)
      setMode('light')
    }
    setMode(mode)
  }

  function updateTheme (type, color) {
    refThemeGen.updatePalette(mode, type, color)
    setTheme(refThemeGen.getTheme(mode))
  }

  useEffect(() => {
    setTheme(refThemeGen.getTheme(mode))
  }, [mode])

  return { theme, changeTheme, updateTheme, generator: refThemeGen }
}

export default useTheme
