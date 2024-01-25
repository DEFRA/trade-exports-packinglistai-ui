describe('Entry point test', () => {
  test('entry point starts server', () => {
    const mockStart = jest.fn()

    jest.mock('../../../../app/server', () => jest.fn(() => {
      return {
        then: mockStart.mockReturnThis(),
        catch: jest.fn()
      }
    }))

    require('../../../../app')

    expect(mockStart.mock.calls.length).toBe(1)
  })
})

describe('Check prepare views function works', () => {
  const path = require('path')
  const nunjucks = require('nunjucks')
  const { options } = require('../../../../app/plugins/views')

  jest.mock('nunjucks')
  jest.mock('path')

  test('should configure nunjucks environment', () => {
    const mockOptions = {
      relativeTo: '/relative/path',
      path: '/path',
      compileOptions: {}
    }
    const next = jest.fn()

    path.join.mockImplementation((...args) => args.join('/'))

    options.engines.njk.prepare(mockOptions, next)

    expect(nunjucks.configure).toHaveBeenCalledWith([
      '/relative/path//path',
      'app/views',
      'node_modules/govuk-frontend/'
    ], {
      autoescape: true
    })
    expect(next).toHaveBeenCalled()
  })
})
