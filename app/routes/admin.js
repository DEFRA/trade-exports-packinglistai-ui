const fs = require('fs')
const config = require('../config')

module.exports = [
  {
    method: 'GET',
    path: '/admin',
    options: {
      handler: (_request, h) => {
        return h.view('admin', { prompt: config.prompt })
      }
    }
  },
  {
    method: 'POST',
    path: '/admin',
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
        // Deal with the prompt
        config.prompt = request.payload.prompt

        /*
          Deal with the golden test data upload. For the PoC, it needs to be a CSV in the following structure:

          {
            Header:
              Business
              Filetype
              Number: packing list ID

            Mandatory information:
              Description of goods              .items[].description
              Nature of products                .items[].the_nature_of_products
              Type of treatment                 .items[].type_of_treatment
              CN code                           .items[].commodity_code
              Establishment number              .registration_approval_number
              Number of packages                .items[].number_of_packages
              Net weight (kg)                   .items[].total_net_weight_kg

            Non mandatory common information:
              Country of origin
              Gross weight
              Part number
              Category
              Other information
          }
        */
        const { payload } = request
        const filename = payload.fileUpload.hapi.filename
        const data = payload.fileUpload._data

        if (!filename) {
          return h.redirect('/admin')
        }

        // If the directory doesn't exist, create it first
        if (!fs.existsSync(config.goldenDataDir)) {
          await fs.promises.mkdir(config.goldenDataDir)
        }

        await fs.promises.writeFile(
          config.goldenDataDir + 'golden-test-data.csv',
          data
        ).catch(err => {
          throw new Error(err)
        })

        return h.redirect('/admin')
      }
    }
  }
]
