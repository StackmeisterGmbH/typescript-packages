import path from 'path'
import fs from 'fs'
import process from 'process'
import commonjs from '@rollup/plugin-commonjs'
import { default as createBabel } from '@rollup/plugin-babel'
import { default as createResolve } from '@rollup/plugin-node-resolve'
import postcss from 'rollup-plugin-postcss'

export const projectTypes = ['react-component-library']

export const createProject = () => {
  const projectRoot = process.cwd()

  const packageConfigFile = path.resolve(projectRoot, 'package.json')
  const packageConfig = JSON.parse(fs.readFileSync(packageConfigFile))

  if (!packageConfig['x-stackmeister'] || !packageConfig['x-stackmeister'].type) {
    throw new Error(
      `Failed to create project: You need to configure the package.json to contain a key "x-stackmeister.type" with one of the following types: ${projectTypes.join(
        ', ',
      )}.`,
    )
  }

  const projectType = packageConfig['x-stackmeister'].type

  const dependencies = {
    ...packageConfig.dependencies,
    ...packageConfig.peerDependencies,
  }
  const dependencyKeys = Object.keys(dependencies)

  const extensions = ['.js', '.jsx', '.ts', '.tsx']

  console.info(
    `Creating rollup config for "${packageConfig.name}" (${projectType}) in "${projectRoot}"...`,
  )

  const output = (format, dir = format) => ({
    dir,
    format,
    exports: 'named',
    preserveModules: true,
    preserveModulesRoot: 'src',
  })

  const cssModules = (options = {}) => {
    const postCssOptions = options.noEmit
      ? {
          modules: true,
          inject: false,
          extract: false,
        }
      : {
          modules: true,
          extract: 'bundle.css',
        }
    return postcss(postCssOptions)
  }

  const resolve = () => createResolve({ extensions })
  const isDependency = id => dependencyKeys.some(externalId => id.startsWith(externalId))
  const babel = () => createBabel({ extensions, babelHelpers: 'runtime', skipPreflightCheck: true })

  switch (projectType) {
    case 'react-component-library': {
      return {
        input: 'src/index.ts',
        output: [output('esm'), output('cjs')],
        external: isDependency,
        plugins: [resolve(), commonjs(), cssModules({}), babel()],
      }
    }
    default:
      throw new Error(`Failed to build: Unknown project type ${projectType}`)
  }
}
