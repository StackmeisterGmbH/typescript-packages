import { fileURLToPath, pathToFileURL } from 'node:url'

const sanitizeDirectoryUrl = (url: URL) => {
  const path = fileURLToPath(url)
  return pathToFileURL(path.endsWith('/') ? path : `${path}/`)
}
export default sanitizeDirectoryUrl
