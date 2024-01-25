const fs = require('fs')
const { method, path: routePath, options } = require('../../../../app/routes/packing-list-upload')

jest.mock('fs')

describe('Packing list view test', () => {
  test('should have a GET method', () => {
    expect(method).toBe('GET')
  })

  test('should have the correct path', () => {
    expect(routePath).toBe('/packing-list-upload')
  })

  test('should create uploads directory if it does not exist', async () => {
    fs.existsSync.mockReturnValue(false)
    fs.promises = {
      mkdir: jest.fn().mockResolvedValue(),
      readdir: jest.fn().mockResolvedValue()
    }

    const h = {
      view: jest.fn()
    }

    await options.handler({}, h)

    expect(fs.existsSync).toBeCalledWith(expect.any(String))
    expect(fs.promises.mkdir).toBeCalledWith(expect.any(String))
  })

  test('should not create uploads directory if it exists', async () => {
    fs.existsSync.mockReturnValue(true)
    fs.promises = {
      mkdir: jest.fn().mockResolvedValue(),
      readdir: jest.fn().mockResolvedValue()
    }

    const h = {
      view: jest.fn()
    }

    await options.handler({}, h)

    expect(fs.promises.mkdir).not.toBeCalled()
  })

  test('should return a file list if uploads directory exists', async () => {
    fs.existsSync.mockReturnValue(true)
    fs.promises.readdir.mockResolvedValue(['file1', 'file2'])

    const h = {
      view: jest.fn()
    }

    await options.handler({}, h)

    expect(h.view).toBeCalledWith('packing-list-upload', { fileList: ['file1', 'file2'] })
  })

  test('should handle errors when reading the directory', async () => {
    fs.existsSync.mockReturnValue(true)
    fs.promises = {
      mkdir: jest.fn().mockResolvedValue(),
      readdir: jest.fn().mockRejectedValue(new Error('Test error'))
    }

    const h = {
      view: jest.fn()
    }
    console.log = jest.fn()

    await options.handler({}, h)

    expect(console.log).toBeCalledWith('ERR: Error: Test error')
  })
})
