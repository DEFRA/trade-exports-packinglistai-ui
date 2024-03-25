const fs = require('fs')
const { uploadsDir } = require('../config')

module.exports = {
  method: 'GET',
  path: '/packing-list-upload',
  options: {
    handler: async (_request, h) => {
      if (!fs.existsSync(uploadsDir)) {
        await fs.promises.mkdir(uploadsDir)
      }

      const fileList = await fs.promises
        .readdir(uploadsDir)
        .then(files => files)
        .catch(err => {
          console.log(`ERR: ${err}`)
        })

      return h.view('packing-list-upload', { fileList })
    }
  }
}
