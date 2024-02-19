const routes = [].concat(
  require('../routes/admin'),
  require('../routes/ai'),
  require('../routes/healthy'),
  require('../routes/healthz'),
  require('../routes/home'),
  require('../routes/static'),
  require('../routes/packing-list-upload'),
  require('../routes/data-analysis'),
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
