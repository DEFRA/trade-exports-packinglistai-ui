const routes = [].concat(
  require('../routes/home'),
  require('../routes/healthy'),
  require('../routes/healthz'),
  require('../routes/static'),
  require('../routes/packing-list-upload'),
  require('../routes/upload')
)

module.exports = {
  plugin: {
    name: 'router',
    register: server => {
      server.route(routes)
    }
  }
}
