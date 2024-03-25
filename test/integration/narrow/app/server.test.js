const createServer = require('../../../../app/server')

describe('Server test', () => {
  let server

  beforeEach(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterEach(async () => {
    await server.stop()
  })

  test('createServer returns server', () => {
    expect(server).toBeDefined()
  })
})
