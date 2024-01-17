const fs = require('fs')
const path = require('path')

module.exports = {
  method: 'GET',
  path: '/packing-list-upload',
  options: {
    handler: async (request, h) => {
      const fileList = await fs.promises
        .readdir(path.join(process.cwd(), '/app/dist/uploads/'))
        .then((files) => {
          return files
        })
        .catch((err) => {
          throw new Error(err)
        })

      return h.view('packing-list-upload', { fileList })
    }
  }
}
