const csvToJson = require('csvtojson')
const fs = require('fs')

const { goldenDataDir, jsonDir } = require('../config')

module.exports = {
  method: 'GET',
  path: '/data-analysis',
  options: {
    handler: async (_request, h) => {
      /*
        1: First off, grab all the golden data and construct it into an array of objects
        2: Then we load all the AI output from the `json` folder
        3: Then we loop through the golden data and match AI output and score it
        4: Then we output this to the user
      */

      // Step 1: grab the golden data and construct it into an array of objects
      let goldenTestData
      try {
        goldenTestData = await csvToJson(
          {
            noheader: false,
            headers: [
              'business',
              'fileType',
              'packingListID',
              'descriptionOfGoods',
              'natureOfProducts',
              'treatmentType',
              'cnCode',
              'establishmentNumber',
              'numberOfPackages',
              'netWeight'
            ]
          }
        ).fromFile(goldenDataDir + 'golden-test-data.csv')
      } catch (err) {
        console.log('Error reading file golden-test-data.csv')
        console.log(`ERR: ${err}`)
        return h.response('notok: Error reading file golden-test-data.csv').code(500)
      }
      // return h.response(goldenAnalysis).code(200)

      // Step 2: load all the AI output from the `json` folder
      const consolidatedAIOutput = []
      const files = await fs.promises.readdir(jsonDir)

      await Promise.all(
        files.map(async file => {
          const filePath = jsonDir + file
          let fileContents

          try {
            fileContents = await fs.promises.readFile(filePath)
          } catch (err) {
            throw new Error(err)
          }
          fileContents = JSON.parse(fileContents)

          fileContents.items.forEach(item => {
            item.packingListID = file.substring(0, file.length - 9)
            item.remosID = fileContents.registration_approval_number
            consolidatedAIOutput.push(item)
          })
        })
      )
      // return h.response(consolidatedAIOutput).code(200)

      // Step 3: loop through the golden data and match AI output and score it
      /*
        GOLDEN:                                   AI:
        business":"B&M"
        "fileType":"XLS"
        "packingListID":"027"                     packingListID: "027"
        "descriptionOfGoods":"PORK CRUNCH 30G"    description: "PORK CRUNCH 30G"
        "natureOfProducts":""                     nature_of_products: "Animal Origin"       <- BAD!
        "treatmentType":""                        type_of_treatment: null
        "cnCode":"20052080"                       commodity_code: 20052080
        "establishmentNumber":"RMS-GB-000005-001" remosID: "RMS-GB-000005-001"
        "numberOfPackages":"1"                    number_of_packages: 1
        "netWeight":"0.99"                        total_net_weight_kg: 0.99
      */

      // For each of the AI items, try and find this item in the golden test data
      // A matching item is one that matches on:
      // - packingListID
      // - descriptionOfGoods

      const dataOutput = []
      // For aiData, find a match of it in goldenitems
      consolidatedAIOutput.forEach(aiItem => {
        goldenTestData.find((o, i) => {
          if (o.packingListID === aiItem.packingListID && o.descriptionOfGoods === aiItem.description) {
            // Description
            const descriptionGTD = goldenTestData[i].descriptionOfGoods
            const descriptionAI = aiItem.description
            const matchDescription = Number(descriptionGTD === descriptionAI)

            // Nature of products
            const natureOfProductsGTD = goldenTestData[i].natureOfProducts
            const natureOfProductsAI = aiItem.nature_of_products
            const matchNatureOfProducts = Number(natureOfProductsGTD === natureOfProductsAI)

            // Treatment type
            const treatmentTypeGTD = goldenTestData[i].treatmentType
            const treatmentTypeAI = aiItem.type_of_treatment
            const matchTreatmentType = Number(treatmentTypeGTD === treatmentTypeAI)
            // TODO: nulls?

            // CN code
            const cnCodeGTD = Number(goldenTestData[i].cnCode)
            const cnCodeAI = aiItem.commodity_code
            const matchCNCode = Number(cnCodeGTD === cnCodeAI)
            // TODO: nulls

            // ReMoS number
            const remosNumberGTD = goldenTestData[i].establishmentNumber
            const remosNumberAI = aiItem.remosID
            const matchRemosNumber = Number(remosNumberGTD === remosNumberAI)

            // Number of packages
            const numberOfPackagesGTD = Number(goldenTestData[i].numberOfPackages)
            const numberOfPackagesAI = Number(aiItem.number_of_packages)
            const matchNumberOfPackages = Number(numberOfPackagesGTD === numberOfPackagesAI)

            // Weights
            const netWeightGTD = Number(parseFloat(goldenTestData[i].netWeight))
            const netWeightAI = Number(parseFloat(aiItem.total_net_weight_kg))
            const matchNetWeight = Number(netWeightGTD === netWeightAI)

            // _Technically_ is this valid against the legislation?
            /*
            (desc, num of package, total net weight, remos number)
            AND
            (
              (nature, treatment) OR (comm code)
            )
            */
            let legislationMatch = 0
            if (matchDescription && matchNumberOfPackages && matchNetWeight && matchRemosNumber) {
              if ((matchNatureOfProducts && matchTreatmentType) || (matchCNCode)) {
                legislationMatch = 1
              }
            }

            // However, if _any_ of the matches are 0 then there's an issue, so highlight this issue too
            let dataIssue = 0
            if (
              !matchDescription ||
              !matchNumberOfPackages ||
              !matchNetWeight ||
              !matchRemosNumber ||
              !matchNatureOfProducts ||
              !matchTreatmentType ||
              !matchCNCode
            ) {
              dataIssue = 1
            }

            const item = {
              business: goldenTestData[i].business,
              packingListID: goldenTestData[i].packingListID,
              description: {
                gtd: descriptionGTD,
                ai: descriptionAI,
                match: matchDescription
              },
              natureOfProducts: {
                gtd: natureOfProductsGTD,
                ai: natureOfProductsAI,
                match: matchNatureOfProducts
              },
              treatmentType: {
                gtd: treatmentTypeGTD,
                ai: treatmentTypeAI,
                match: matchTreatmentType
              },
              cnCode: {
                gtd: cnCodeGTD,
                ai: cnCodeAI,
                match: matchCNCode
              },
              remosNumber: {
                gtd: remosNumberGTD,
                ai: remosNumberAI,
                match: matchRemosNumber
              },
              numberOfPackages: {
                gtd: numberOfPackagesGTD,
                ai: numberOfPackagesAI,
                match: matchNumberOfPackages
              },
              netWeight: {
                gtd: netWeightGTD,
                ai: netWeightAI,
                match: matchNetWeight
              },
              legislationMatch,
              dataIssue
            }
            dataOutput.push(item)

            return true
          }
          return false
        })
      })
      // return h.response(dataOutput).code(200)

      // Step 4: output this to the user
      //  Tinker with the data to make it fit into govukTable
      // const errorClass = 'govuk-error-table'
      const rowsOutput = []
      dataOutput.forEach(item => {
        rowsOutput.push([
          { text: item.business },
          { text: item.packingListID },
          { text: item.description.gtd },
          { text: item.description.ai },
          { text: item.natureOfProducts.gtd },
          { text: item.natureOfProducts.ai },
          { text: item.treatmentType.gtd },
          { text: item.treatmentType.ai },
          { text: item.cnCode.gtd },
          { text: item.cnCode.ai },
          { text: item.remosNumber.gtd },
          { text: item.remosNumber.ai },
          { text: item.numberOfPackages.gtd },
          { text: item.numberOfPackages.ai },
          { text: item.netWeight.gtd },
          { text: item.netWeight.ai },
          { text: item.legislationMatch === 0 ? 'Invalid' : 'Valid' },
          { text: item.dataIssue === 0 ? 'No issues' : 'Issues' }

          // {
          //   text: (item.natureOfProducts === '' ? 'N/A' : item.natureOfProducts),
          //   classes: item.natureOfProductsMatch === 0 ? errorClass : ''
          // },
          // {
          //   text: (item.treatmentType === '' ? 'N/A' : item.treatmentType),
          //   classes: item.treatmentTypeMatch === 0 ? errorClass : ''
          // },
          // {
          //   text: (item.cnCode === '' ? 'N/A' : item.cnCode),
          //   classes: item.cnCodeMatch === 0 ? errorClass : ''
          // },
          // {
          //   text: item.establishmentNumber,
          //   classes: item.remosNumberMatch === 0 ? errorClass : ''
          // },
          // {
          //   text: item.numberOfPackages,
          //   classes: item.numberOfPackagesMatch === 0 ? errorClass : ''
          // },
          // {
          //   text: item.netWeight,
          //   classes: item.netWeightMatch === 0 ? errorClass : ''
          // },
          // {
          //   text: item.legislationMatch === 0 ? 'Not matched' : 'Matched',
          //   classes: item.legislationMatch === 0 ? errorClass : ''
          // }
        ])
      })
      // return h.response(goldenDataOutput).code(200)

      return h.view('data-analysis', { output: rowsOutput })
    }
  }
}
