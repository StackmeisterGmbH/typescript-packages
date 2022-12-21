import type { Command } from 'commander'
import { stringify } from 'yaml'
import { highlight } from 'cli-highlight'
import { createHost } from '../../host.js'
import { pathToFileURL } from 'node:url'

const registerQueryCommand = (app: Command) =>
  app
    .command('query')
    .description('Query the Nanic CMS Registry')
    .argument('<path>', 'Path to the Nanic CMS Site file or folder')
    .argument('<expression>', 'The query to run')
    .option('-c, --colors', 'Enable colors')
    .action(async (path, expression, options) => {
      const host = await createHost({ baseUrl: pathToFileURL(process.cwd()), sitePaths: [path] })
      const result = await host.query(expression)
      if (result === undefined) {
        console.log('> No result <')
        return
      }
      const yaml = stringify(JSON.parse(JSON.stringify(result)), {})
      console.log(
        options.colors ? highlight(yaml, { language: 'yaml', ignoreIllegals: true }) : yaml,
      )
    })

export default registerQueryCommand
