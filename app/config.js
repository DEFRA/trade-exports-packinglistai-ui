const path = require('path')

module.exports = {
  maxUploadBytes: 25 * 1000 * 1000,

  goldenDataDir: path.join(process.cwd(), '/app/dist/golden-test-data/'),
  jsonDir: path.join(process.cwd(), '/app/dist/json/'),
  uploadsDir: path.join(process.cwd(), '/app/dist/uploads/'),

  prompt: process.env.AI_PROMPT,
  azureResource: process.env.AI_AZURE_RESOURCE,
  openAIModel: process.env.AI_OPENAI_MODEL,
  apiVersion: process.env.AI_API_VERSION,
  azureOpenAIKey: process.env.AI_OPENAI_KEY
}
