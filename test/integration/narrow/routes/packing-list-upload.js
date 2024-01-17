describe('Packing list view test', () => {
  const server = require('../../../../app/server')

  beforeEach(async () => {
    await server.start()
  })

  test('GET /packing-list-upload route returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/packing-list-upload'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  afterEach(async () => {
    await server.stop()
  })
})
