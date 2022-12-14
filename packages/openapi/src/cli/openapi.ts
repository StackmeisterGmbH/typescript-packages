#!/usr/bin/env node
import { program } from 'commander'
import registerViewCommand from './modules/view'

program.name('openapi').description('An OpenAPI swiss knife').version('0.0.1')

registerViewCommand(program)

program.parse()
