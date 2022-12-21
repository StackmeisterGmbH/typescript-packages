import type { Command } from 'commander'
import { createServer } from 'node:http'
import { pathToFileURL } from 'node:url'
import { createHost } from '../../host.js'

const registerServeCommand = (app: Command) =>
  app
    .command('serve')
    .description('Serve a Nanic CMS Site')
    .argument('<path>', 'Path to the Nanic CMS Site file or folder')
    .option('-w, --watch', 'Watch for changes and reload the site')
    .action(async (path, options) => {
      console.log(`Creating Nanic Host for site ${path}`)
      const host = await createHost({
        baseUrl: pathToFileURL(process.cwd()),
        sitePaths: [path],
        watch: options.watch,
      })
      const server = createServer(host.handleRequest)
      server.listen(3000, () => {
        console.log('Listening on port 3000')
      })
    })

export default registerServeCommand
