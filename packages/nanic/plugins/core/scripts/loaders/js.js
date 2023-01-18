import debug from 'debug'

const log = debug('nanic:loaders:js')

export const load = async (url) => {
  log('load %s', url)
  const document = await import(url.toString(), { cache: false })
  return [document]
}
