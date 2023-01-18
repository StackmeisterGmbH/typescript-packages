export const handleRequest = async ({ req, res, registry }) => {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(Object.keys(registry)))
}
