const hapi = require('@hapi/hapi')

async function createServer () {
  const server = hapi.server({
    port: process.env.PORT,
    routes: {
      validate: {
        options: {
          abortEarly: false
        }
      }
    },
    router: {
      stripTrailingSlash: true
    }
  })

  // Register the plugins
  await server.register(require('@hapi/inert'))
  await server.register(require('./plugins/views'))
  await server.register(require('./plugins/router'))

  return server
}

module.exports = createServer
