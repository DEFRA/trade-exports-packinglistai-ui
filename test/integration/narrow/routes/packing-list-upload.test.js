const createServer = require('../../../../app/server')

describe.skip('Packing list view test', () => {
  let server

  beforeEach(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterEach(async () => {
    await server.stop()
  })

  test('GET /packing-list-upload route returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/packing-list-upload'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })
})
