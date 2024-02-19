const fs = require('fs')
const { apiVersion, azureOpenAIKey, azureResource, jsonDir, openAIModel, uploadsDir } = require('../config')
let { prompt } = require('../config')
const OpenAI = require('openai')

module.exports = {
  method: 'GET',
  path: '/ai/{file}',
  options: {
    handler: async (request, h) => {
      // Grab the file from the URL
      const filename = request.params.file

      // Replace line breaks with \ns to help interpretation by the AI
      prompt = prompt.replace(/(?:\r\n|\r|\n)/g, '\\n')

      // First off, try and find the file
      let fileContents
      try {
        fileContents = await fs.promises.readFile(
          uploadsDir + filename
        )
      } catch (err) {
        console.log(`Error reading file ${filename}`)
        console.log(`ERR: ${err}`)
        return h.response(`notok: ${request.params.file}`).code(500)
      }

      fileContents = fileContents.toString()

      console.log(fileContents)

      // # We've now got the fileContents in a string, so now pipe it over to AI

      // Name of the Azure OpenAI Resource
      const resource = azureResource

      // Model deployed
      const model = openAIModel

      // API version
      // const apiVersion = apiVersion

      // API key
      const apiKey = azureOpenAIKey

      // Setup OpenAI
      const openai = new OpenAI({
        apiKey,
        baseURL: `https://${resource}.openai.azure.com/openai/deployments/${model}`,
        defaultQuery: { 'api-version': apiVersion },
        defaultHeaders: { 'api-key': apiKey }
      })

      // TODO:
      // Check out: await openai.files.create({ file: fs.createReadStream('input.jsonl'), purpose: 'fine-tune' })

      try {
        console.log('Asking AI...')
        const result = await openai.chat.completions.create({
          model,
          messages: [
            {
              role: 'system',
              content: prompt
            },
            {
              role: 'user',
              content: fileContents
            }
          ]
        })
        const aiOutput = result.choices[0].message.content

        // The text contains ```json\n at the beginning and \n```` at the end, to strip it out
        const strippedContent = aiOutput.substring(8, aiOutput.length - 4)

        // Write this to a file now:
        // First off, see if there's a dir there to write to
        if (!fs.existsSync(jsonDir)) {
          await fs.promises.mkdir(jsonDir)
        }
        await fs.promises.writeFile(
          jsonDir + filename + '.json',
          strippedContent
        ).catch(err => {
          throw new Error(err)
        })

        // For the sake of the demos, we'll output some formatted code to the logging...
        // Convert it to JSON
        const jsonOutput = JSON.parse(strippedContent)
        // ReMoS identifier
        const remosID = jsonOutput.registration_approval_number
        // Packing list rows
        const packingListRows = jsonOutput.items
        console.log(`remosID: ${remosID}`)
        console.log(`packingListRows: ${JSON.stringify(packingListRows)}`)
        return h.response(JSON.stringify(jsonOutput, undefined, 2)).code(200)
      } catch (err) {
        console.error(err)
        return h.response(err).code(500)
      }
    }
  }
}
