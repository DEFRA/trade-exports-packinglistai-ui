let { prompt: promptConfig } = require('../config')

module.exports = [
  {
    method: 'GET',
    path: '/admin',
    options: {
      handler: (_request, h) => {
        return h.view('admin', { prompt: promptConfig })
      }
    }
  },
  {
    method: 'POST',
    path: '/admin',
    options: {
      handler: (request, h) => {
        promptConfig = request.payload.prompt
        return h.redirect('/admin')
      }
    }
  }
]
