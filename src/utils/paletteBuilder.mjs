import { readFileSync } from 'node:fs'

// Paste the color array from (Coolors.co -> Generator -> Export -> Code -> array) into colors.txt
function main() {
  const colorsText = readFileSync('./src/utils/colors.txt').toString()
  let colorArray = colorsText.slice(colorsText.indexOf('- Array'))
  colorArray = colorArray.slice(colorArray.indexOf('['), colorArray.indexOf(']') + 1)
  colorArray = JSON.parse(colorArray)
  const colorDict = {}
  colorArray.forEach((color, index) => {
    colorDict[index + 1] = `#${color}`
  })
  console.log(JSON.stringify(colorDict, null, 2))
}

main()