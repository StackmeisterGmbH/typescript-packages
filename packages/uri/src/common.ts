/**
 * Represents an URI (URL or URN) as a string.
 *
 * It mainly acts as a visual indicator, as TypeScript
 * can't define the complexity of a URI through literal
 * types alone yet.
 */
export type Uri = string

/**
 * Represents the single parts of an URI (URL or URN) as an object.
 */
export type UriComponents = {
  readonly scheme?: string
  readonly userInfo?: string
  readonly host?: string
  readonly port?: number
  readonly path?: string
  readonly query?: string
  readonly fragment?: string
}
