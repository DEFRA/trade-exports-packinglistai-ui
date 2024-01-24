const createServer = require('../../../../app/server')

describe.skip('Upload view test', () => {
  let server

  beforeEach(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterEach(async () => {
    await server.stop()
  })

  test('GET /upload route returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/upload'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })
})
