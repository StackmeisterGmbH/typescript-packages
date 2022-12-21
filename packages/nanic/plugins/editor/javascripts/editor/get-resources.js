const getResources = async ({ req, res }) => {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ message: 'Hello Warld!' }))
}

export default getResources
