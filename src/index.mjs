import { watch, readFileSync } from 'node:fs'
import chalk from 'chalk';

import themeBuilder from './themeBuilder/index.mjs'

const configPath = './src/themes/config.json'

function readConfig() {
  const config = readFileSync(configPath)
  return JSON.parse(config.toString())
}

// pass watch as a flag to allow us to just build as well
async function main() {
  console.clear()
  console.log(chalk.blue('🌝 Watching for changes...'));
  let config = readConfig()
  console.log('config from main init', config)
  themeBuilder(config)

  watch(configPath, async (eventType, filename) => {
    console.log('eventType', eventType)
    console.log('filename', filename)

    config = readConfig()
    themeBuilder(config)
  })
}

main()