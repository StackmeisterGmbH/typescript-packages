import { dirname } from 'node:path'
import { pathToFileURL, fileURLToPath } from 'url'

const urlDirname = (url: URL): URL => pathToFileURL(dirname(fileURLToPath(url)))
export default urlDirname
