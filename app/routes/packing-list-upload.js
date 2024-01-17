const fs = require('fs')
const path = require('path')

module.exports = {
  method: 'GET',
  path: '/packing-list-upload',
  options: {
    handler: async (request, h) => {
      const uploadsDir = path.join(process.cwd(), '/app/dist/uploads/')

      // 1: See whether there's an uploads dir yet created or not
      if (!fs.existsSync(uploadsDir)) {
        // 2: If not there, create it
        await fs.promises.mkdir(uploadsDir)
      }

      // 3: It's there, read the stack of files
      const fileList = await fs.promises
        .readdir(uploadsDir)
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
