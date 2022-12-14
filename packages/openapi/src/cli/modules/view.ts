import type { Command } from 'commander'
import { resolve } from 'node:path'
import { importSpec, renderSpec } from '../utils'

const registerViewCommand = (app: Command) =>
  app
    .command('view')
    .description('View the OpenAPI document')
    .argument('<file>', 'The OpenAPI document file')
    .option('-f, --format [format]', 'The output format', 'yaml')
    .option('--no-color', 'Disable colors in the output', false)
    .action(async (file, options) => {
      console.log(`Viewing ${file}, colors: ${options.color}`)
      const fullPath = resolve(process.cwd(), file)
      const spec = await importSpec(fullPath)
      console.log(await renderSpec(spec, { format: options.format, colored: !options.noColor }))
    })

export default registerViewCommand
