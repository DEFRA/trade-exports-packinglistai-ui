const fs = require('fs')
const path = require('path')
const { method, path: routePath, options } = require('../../../../app/routes/upload')

jest.mock('fs')
jest.mock('path')

describe('upload', () => {
  test('should have a POST method', () => {
    expect(method).toBe('POST')
  })

  test('should have the correct path', () => {
    expect(routePath).toBe('/upload')
  })

  test('should handle file upload', async () => {
    const h = {
      redirect: jest.fn()
    }

    const request = {
      payload: {
        fileUpload: {
          hapi: {
            filename: 'test.txt'
          },
          _data: Buffer.from('test')
        }
      }
    }

    fs.promises = {
      writeFile: jest.fn().mockResolvedValue()
    }

    path.join.mockReturnValue('/app/dist/uploads/')

    await options.handler(request, h)

    expect(fs.promises.writeFile).toBeCalledWith('/app/dist/uploads/test.txt', Buffer.from('test'))
  })

  test('should redirect if no filename', async () => {
    const h = {
      redirect: jest.fn()
    }

    const request = {
      payload: {
        fileUpload: {
          hapi: {
            filename: ''
          },
          _data: Buffer.from('test')
        }
      }
    }

    await options.handler(request, h)

    expect(h.redirect).toBeCalledWith('/packing-list-upload')
  })

  test('should throw an error if writing the file fails', async () => {
    const h = {
      redirect: jest.fn()
    }

    const request = {
      payload: {
        fileUpload: {
          hapi: {
            filename: 'test.txt'
          },
          _data: Buffer.from('test')
        }
      }
    }

    fs.promises = {
      writeFile: jest.fn().mockRejectedValue(new Error('Test error'))
    }

    path.join.mockReturnValue('/app/dist/uploads/')

    await expect(options.handler(request, h)).rejects.toThrow('Test error')
  })
})
