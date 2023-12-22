import { writeFileSync } from 'node:fs'

const colorThemeJsonPath = './themes/new-tones-color-theme.json'

function themeBuilder(config) {
  console.log('called themeBuilder')
  console.log('config from themeBuilder', config)
  const selectedThemeConfig = config.themes[config.selectedTheme]
  const selectedColorMapConfig = config.colorMaps[config.selectedColorMap]
  const content = {
    $schema: 'vscode://schemas/color-theme',
	  type: 'dark',
    colors: {},
    tokenColors: [],
  }

  const tokenDictionary = {}
  // TODO: ITERATE OVER OBJECT.ENTRIES INSTEAD
  const colorKeys = Object.keys(selectedThemeConfig.palette)

  // Apply the selected colorMap to the token dictionary
  colorKeys.forEach((colorKey) => {
    // Assign colors to UI elements
    selectedColorMapConfig.colors[colorKey].forEach(element => {
      content.colors[element] = selectedThemeConfig.palette[colorKey]
    })

    // Apply the colors to each token attribute in the dictionary
    const tokenAttributes = Object.keys(selectedColorMapConfig.tokenColors[colorKey])
    console.log('tokenAttributes', tokenAttributes)
    tokenAttributes.forEach(attribute => {
      selectedColorMapConfig.tokenColors[colorKey][attribute].forEach(token => {
        tokenDictionary[token] = {
          ...tokenDictionary[token],
          [attribute]: selectedThemeConfig.palette[colorKey],
        }
      })
    })
  })
  console.log('tokenDictionary after colorMap', tokenDictionary)

  // Apply theme overrides to the token dictionary
  colorKeys.forEach((colorKey) => {
    // Assign colors to UI elements
    const elements = selectedThemeConfig.colors[colorKey]?.elements || []
    elements.forEach(element => {
      content.colors[element] = selectedThemeConfig.palette[colorKey]
    })

    // Apply the colors to each token attribute in the dictionary
    const tokenAttributes = Object.keys(selectedThemeConfig.colors[colorKey]?.tokens || {})
    console.log('tokenAttributes', tokenAttributes)
    tokenAttributes.forEach(attribute => {
      selectedThemeConfig.colors[colorKey].tokens[attribute].forEach(token => {
        tokenDictionary[token] = {
          ...tokenDictionary[token],
          [attribute]: selectedThemeConfig.palette[colorKey],
        }
      })
    })
    console.log('tokenDictionary after colors', tokenDictionary)

    // Apply the fontStyles to each token in the dictionary
    const fontStyles = Object.keys(selectedThemeConfig.fontStyles)
    fontStyles.forEach(style => {
      selectedThemeConfig.fontStyles[style].forEach(token => {
        tokenDictionary[token] = {
          ...tokenDictionary[token],
          fontStyle: style,
        }
      })
    })

  })

  // Transform the dictionary into the color-theme JSON format and add it to content
  const tokens = Object.keys(tokenDictionary)
  tokens.forEach(token => {
    const tokenConfig = {
      scope: token,
      settings: {},
    }
    const tokenAttributes = Object.keys(tokenDictionary[token])
    tokenAttributes.forEach(tokenAttribute => {
      tokenConfig.settings[tokenAttribute] = tokenDictionary[token][tokenAttribute]
    })
    content.tokenColors.push(tokenConfig)
  })
  console.log('content', content)

  writeFileSync(colorThemeJsonPath, JSON.stringify(content, null, 2))
}

export default themeBuilder