export const handleRequest = async ({ res, params, registry }) => {
  const { collectionName } = params
  
  if (!collectionName) {
    res.writeHead(400)
    res.end()
  }

  if (!(collectionName in registry)) {
    res.writeHead(404)
    res.end()
  }

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(Object.values(registry[collectionName])))
}
