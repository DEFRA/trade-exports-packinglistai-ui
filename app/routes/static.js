module.exports = [
  {
    method: 'GET',
    path: '/assets/{path*}',
    options: {
      handler: {
        directory: {
          path: ['node_modules/govuk-frontend/govuk/assets']
        }
      },
      cache: {
        privacy: 'private'
      }
    }
  },
  {
    method: 'GET',
    path: '/govuk-frontend/govuk/{path*}',
    options: {
      handler: {
        directory: {
          path: ['node_modules/govuk-frontend/govuk']
        }
      },
      cache: {
        privacy: 'private'
      }
    }
  },
  {
    method: 'GET',
    path: '/static/{path*}',
    options: {
      handler: {
        directory: {
          path: ['app/dist', 'node_modules/govuk-frontend/govuk/assets']
        }
      },
      cache: {
        privacy: 'private'
      }
    }
  },
  {
    method: 'GET',
    path: '/json/{path*}',
    options: {
      handler: {
        directory: {
          path: ['app/dist/json']
        }
      },
      cache: {
        privacy: 'private'
      }
    }
  },
  {
    method: 'GET',
    path: '/uploads/{path*}',
    options: {
      handler: {
        directory: {
          path: ['app/dist/uploads']
        }
      },
      cache: {
        privacy: 'private'
      }
    }
  }
]
