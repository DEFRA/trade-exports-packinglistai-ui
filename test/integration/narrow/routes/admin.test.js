const fs = require('fs')
const routes = require('../../../../app/routes/admin')
const config = require('../../../../app/config')

jest.mock('fs', () => ({
  promises: {
    writeFile: jest.fn(() => Promise.resolve())
  }
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

  test('should update the prompt config and redirect for POST /admin', () => {
    fs.existsSync.mockReturnValue(false)

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
    route.options.handler(request, h)

    expect(fs.existsSync).toBeCalledWith(expect.any(String))
    expect(fs.promises.writeFile).toHaveBeenCalledWith(
      config.goldenDataDir + 'test.csv',
      Buffer.from('test data')
    )
    expect(config.prompt).toBe('new prompt')
    expect(h.redirect).toHaveBeenCalledWith('/admin')
  })
})
