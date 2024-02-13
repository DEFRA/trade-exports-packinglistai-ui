const fs = require('fs')
const config = require('../../../../app/config')
const { method, path: routePath, options } = require('../../../../app/routes/upload')

jest.mock('fs', () => ({
  promises: {
    writeFile: jest.fn(() => Promise.resolve())
  }
}))

describe('upload', () => {
  test('should have a POST method', () => {
    expect(method).toBe('POST')
  })

  test('should have the correct path', () => {
    expect(routePath).toBe('/upload')
  })

  test('should handle file upload', async () => {
    const mockRequest = {
      payload: {
        fileUpload: {
          hapi: {
            filename: 'test.txt'
          },
          _data: Buffer.from('test')
        }
      }
    }

    const mockH = {
      redirect: jest.fn()
    }

    await options.handler(mockRequest, mockH)

    expect(fs.promises.writeFile).toHaveBeenCalledWith(
      config.uploadsDir + 'test.txt',
      Buffer.from('test')
    )
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

    await expect(options.handler(request, h)).rejects.toThrow('Test error')
  })
})
