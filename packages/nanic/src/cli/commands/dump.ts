import type { Command } from 'commander'
import { stringify } from 'yaml'
import { highlight } from 'cli-highlight'
import { createHost } from '../../host.js'
import { pathToFileURL } from 'node:url'

const registerDumpCommand = (app: Command) =>
  app
    .command('dump')
    .description('Dump a Nanic CMS registry')
    .argument('<path>', 'Path to the Nanic CMS Site file or folder')
    .option('-c, --colors', 'Enable colors')
    .action(async (path, options) => {
      const host = await createHost({ baseUrl: pathToFileURL(process.cwd()), sitePaths: [path] })
      const yaml = stringify(JSON.parse(JSON.stringify(host.getRegistry())))
      console.log(
        options.colors ? highlight(yaml, { language: 'yaml', ignoreIllegals: true }) : yaml,
      )
    })

export default registerDumpCommand
