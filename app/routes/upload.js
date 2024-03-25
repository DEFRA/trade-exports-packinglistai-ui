const fs = require('fs')
const config = require('../config')

module.exports = {
  method: 'POST',
  path: '/upload',
  options: {
    payload: {
      maxBytes: config.maxUploadBytes,
      parse: true,
      multipart: {
        output: 'stream'
      },
      output: 'stream'
    },
    handler: async (request, h) => {
      const { payload } = request
      const filename = payload.fileUpload.hapi.filename
      const data = payload.fileUpload._data

      if (!filename) {
        return h.redirect('/packing-list-upload')
      }

      await fs.promises.writeFile(
        config.uploadsDir + filename,
        data
      ).catch(err => {
        throw new Error(err)
      })

      return h.redirect('/packing-list-upload')
    }
  }
}