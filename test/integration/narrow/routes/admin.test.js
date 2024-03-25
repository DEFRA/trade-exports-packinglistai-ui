const fs = require('fs')
const routes = require('../../../../app/routes/admin')
const config = require('../../../../app/config')

jest.mock('fs', () => ({
  promises: {
    mkdir: jest.fn(() => Promise.resolve()),
    writeFile: jest.fn(() => Promise.resolve())
  },
  existsSync: jest.fn()
}))

describe('Admin view test', () => {
  test('should have a GET method', () => {
    const route = routes.find(route => route.path === '/admin' && route.method === 'GET')
    expect(route).toBeDefined()
  })

  test('should have a POST method', () => {
    const route = routes.find(route => route.path === '/admin' && route.method === 'POST')
    expect(route).toBeDefined()
  })

  test('should return the admin view with the prompt config for GET /admin', () => {
    const route = routes.find(route => route.path === '/admin' && route.method === 'GET')
    const h = { view: jest.fn() }
    route.options.handler({}, h)
    expect(h.view).toHaveBeenCalledWith('admin', { prompt: config.prompt })
  })

  test('should update the prompt config and redirect for POST /admin', async () => {
    const route = routes.find(route => route.path === '/admin' && route.method === 'POST')
    const h = { redirect: jest.fn() }
    const request = {
      payload: {
        prompt: 'new prompt',
        fileUpload: {
          hapi: { filename: 'test.csv' },
          _data: Buffer.from('test data')
        }
      }
    }

    fs.existsSync.mockReturnValue(false)

    await route.options.handler(request, h)

    expect(config.prompt).toBe('new prompt')
    expect(h.redirect).toHaveBeenCalledWith('/admin')
    expect(fs.promises.mkdir).toHaveBeenCalledWith(config.goldenDataDir)
    expect(fs.promises.writeFile).toHaveBeenCalledWith(
      `${config.goldenDataDir}golden-test-data.csv`,
      expect.any(Buffer)
    )
  })
})
