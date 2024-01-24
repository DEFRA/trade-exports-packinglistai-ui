require('./insights').setup()

const createServer = require('./server')

createServer()
  .then(server => {
    console.log('Server running on %s', server.info.uri)
    server.start()
  })
  .catch(err => {
    console.log(`ERR: ${err}`)
    process.exit(1)
  })
