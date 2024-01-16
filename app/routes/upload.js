const fs = require("fs");
const path = require("path")

module.exports = {
  method: "POST",
  path: "/upload",
  options: {
    payload: {
      maxBytes: 25 * 1000 * 1000,
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

      await fs.promises
        .writeFile(
          path.join(process.cwd(), "/app/dist/uploads/") + filename,
          data
        )

      return h.redirect('/packing-list-upload')
    }
  }
}