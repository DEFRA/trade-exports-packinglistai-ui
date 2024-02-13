const path = require('path')

// TODO: pending secret hookup

module.exports = {
  maxUploadBytes: 25 * 1000 * 1000,
  uploadsDir: path.join(process.cwd(), '/app/dist/uploads/'),
  jsonDir: path.join(process.cwd(), '/app/dist/json/'),
  prompt: `# Heading level 1
## Heading level 2`,
  azureResource: '',
  openAIModel: 'gpt-4-turbo',
  apiVersion: '',
  azureOpenAIKey: ''
}
