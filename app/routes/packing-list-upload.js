const fs = require('fs')
const path = require('path')

module.exports = {
  method: 'GET',
  path: '/packing-list-upload',
  options: {
    handler: async (_request, h) => {
      const uploadsDir = path.join(process.cwd(), '/app/dist/uploads/')

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
