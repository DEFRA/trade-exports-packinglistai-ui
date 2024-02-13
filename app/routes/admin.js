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
      handler: (request, h) => {
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
              Description of goods
              Nature of products
              Type of treatment
              CN code
              Establishment number
              Number of packages
              Net weight (kg)

            Non mandatory common information:
              Country of origin
              Gross weight
              Part number
              Category
              Other information
          }
        */

        return h.redirect('/admin')
      }
    }
  }
]
