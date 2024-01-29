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
        config.prompt = request.payload.prompt
        return h.redirect('/admin')
      }
    }
  }
]
