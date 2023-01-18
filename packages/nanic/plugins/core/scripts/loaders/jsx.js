import { writeFile, unlink } from 'node:fs/promises'
import debug from 'debug'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname } from 'node:path'

const log = debug('nanic:loaders:jsx')

export const load = async (url) => {
  log('load %s', url)
  const { transformFileAsync } = await import('@babel/core')
  const js = (await transformFileAsync(fileURLToPath(url), {
    babelrc: false,
    configFile: false,
    cwd: dirname(fileURLToPath(url)),
    presets: [
      ['@babel/preset-env', { modules: false, configPath: dirname(fileURLToPath(url)) }],
      ['@babel/preset-react', { runtime: 'automatic' }],
    ],
  })).code
  const jsUrl = pathToFileURL(fileURLToPath(url) + '.js')
  try {
    await writeFile(jsUrl, js, 'utf8')
    const document = await import(jsUrl.toString(), { cache: false })
    return [document]
  } finally {
    await unlink(jsUrl)
  }
}
