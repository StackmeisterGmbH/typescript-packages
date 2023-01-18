export const handleRequest = async ({ res, params, registry }) => {
  const { collectionName, id } = params
  
  if (!collectionName || !id) {
    res.writeHead(400)
    res.end()
    return
  }

  if (!(collectionName in registry) || !(id in registry[collectionName])) {
    res.writeHead(404)
    res.end()
    return
  }

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(registry[collectionName][id]))
}
