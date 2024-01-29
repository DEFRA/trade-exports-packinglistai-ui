const routes = require('../../../../app/routes/admin')

jest.mock('../../../../app/config', () => ({ prompt: 'initial prompt' }))

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
    expect(h.view).toHaveBeenCalledWith('admin', { prompt: 'initial prompt' })
  })

  test('should update the prompt config and redirect for POST /admin', () => {
    const route = routes.find(route => route.path === '/admin' && route.method === 'POST')
    const h = { redirect: jest.fn() }
    const request = { payload: { prompt: 'new prompt' } }
    route.options.handler(request, h)
    expect(require('../../../../app/config').prompt).toBe('new prompt')
    expect(h.redirect).toHaveBeenCalledWith('/admin')
  })
})
