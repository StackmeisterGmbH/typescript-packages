/* eslint-disable @typescript-eslint/no-var-requires */
let defaultResolver

const requireDefaultResolver = () => {
  if (!defaultResolver) {
    try {
      defaultResolver = require(`jest-resolve/build/defaultResolver`).default
    } catch (error) {
      defaultResolver = require(`jest-resolve/build/default_resolver`).default
    }
  }

  return defaultResolver
}

module.exports = (request, options) => {
  const { defaultResolver = requireDefaultResolver() } = options
  try {
    return defaultResolver(request, options)
  } catch (e) {
    return defaultResolver(request.replace(/\.js$/, '.ts'), options)
  }
}
