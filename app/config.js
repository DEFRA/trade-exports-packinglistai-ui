const path = require('path')

module.exports = {
  maxUploadBytes: 25 * 1000 * 1000,

  goldenDataDir: path.join(process.cwd(), '/app/dist/golden-test-data/'),
  jsonDir: path.join(process.cwd(), '/app/dist/json/'),
  uploadsDir: path.join(process.cwd(), '/app/dist/uploads/'),

  prompt: `# Heading level 1
## Heading level 2`,
  azureResource: '',
  openAIModel: 'gpt-4-turbo',
  apiVersion: '',
  azureOpenAIKey: ''
}
