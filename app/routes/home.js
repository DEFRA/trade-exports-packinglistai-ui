module.exports = {
  method: 'GET',
  path: '/',
  options: {
    handler: (_request, h) => h.view('home')
  }
}
