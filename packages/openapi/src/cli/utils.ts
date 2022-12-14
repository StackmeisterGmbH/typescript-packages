import type { CompilerOptions } from 'typescript'
import { resolve, basename, extname, dirname } from 'node:path'
import { readFile, rmdir } from 'node:fs/promises'
import type DocumentObject from '../objects/DocumentObject'
import { inspect } from 'node:util'

export const evaluateTypeScript = async (fileName: string): Promise<unknown> => {
  const {
    createProgram,
    getPreEmitDiagnostics,
    getLineAndCharacterOfPosition,
    flattenDiagnosticMessageText,
    ScriptTarget,
    ModuleKind,
  } = await import('typescript')
  const outDir = resolve(process.cwd(), '.stackmeister-openapi-compiled-js')
  const relativePath = dirname(fileName).substring(process.cwd().length + 1)
  const outFile = resolve(outDir, relativePath, basename(fileName, extname(fileName)) + '.js')
  const options: CompilerOptions = {
    noEmitOnError: true,
    noImplicitAny: true,
    outDir,
    rootDir: process.cwd(),
    target: ScriptTarget.ES5,
    module: ModuleKind.CommonJS,
  }
  const program = createProgram([fileName], options)
  const emitResult = program.emit()
  console.log(emitResult)

  const allDiagnostics = getPreEmitDiagnostics(program).concat(emitResult.diagnostics)

  allDiagnostics.forEach(diagnostic => {
    if (diagnostic.file) {
      const { line, character } = getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start!)
      const message = flattenDiagnosticMessageText(diagnostic.messageText, '\n')
      console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`)
    } else {
      console.log(flattenDiagnosticMessageText(diagnostic.messageText, '\n'))
    }
  })

  if (emitResult.emitSkipped) {
    await rmdir(outDir, { recursive: true })
    throw new Error('TypeScript compilation failed')
  }

  const { default: result } = await import(outFile)
  await rmdir(outDir, { recursive: true })

  return result
}

export const importSpec = async (path: string) => {
  const ext = extname(path)
  switch (ext) {
    case '.ts': {
      const spec = await evaluateTypeScript(path)
      return spec as DocumentObject
    }
    case '.js': {
      const { default: spec } = await import(path)
      return spec
    }
    case '.json': {
      const content = await readFile(path, 'utf-8')
      return JSON.parse(content)
    }
    case '.yml':
    case '.yaml': {
      const {
        default: { parse },
      } = await import('yaml')
      const content = await readFile(path, 'utf-8')
      return parse(content)
    }
    default:
      throw new Error(`Unsupported API spec file extension: ${ext}`)
  }
}

export type RenderOptions = {
  format: string
  colored: boolean
}

export const renderSpec = async (spec: DocumentObject, options: RenderOptions) => {
  switch (options.format) {
    case 'json':
      return inspect(spec, { depth: Infinity, colors: options.colored })
    case 'yaml':
    case 'yml':
    default: {
      const {
        default: { stringify },
      } = await import('yaml')
      const { highlight } = await import('cli-highlight')
      return options.colored
        ? highlight(stringify(spec), { language: 'yaml', ignoreIllegals: true })
        : stringify(spec)
    }
  }
}
