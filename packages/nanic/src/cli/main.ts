import { program } from 'commander'
import registerDumpCommand from './commands/dump.js'
import registerQueryCommand from './commands/query.js'
import registerServeCommand from './commands/serve.js'
import debug from 'debug'

program
  .name('nanic')
  .description('The Nanic CMS CLI')
  .version('0.0.1')
  .option('-v, --verbose', 'Enable verbose logging', false)
  .hook('preAction', command => {
    if (command.opts().verbose) {
      debug.enable('nanic:*')
    } else {
      debug.disable()
    }
  })

registerServeCommand(program)
registerDumpCommand(program)
registerQueryCommand(program)

program.parse()
