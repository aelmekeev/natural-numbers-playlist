/**
 * Note: this validation currently supports only number up to 99
 */

const fs = require('fs')
const utils = require('../utils')

let root = process.env.GITHUB_WORKSPACE

const data = fs.readFileSync(`${root}/playlist.json`, 'utf8')
const playlist = JSON.parse(data)

const testTrackName = (trackName, number) => {
  dehydratedTrackName = utils.dehydrateTitle(trackName)
  convertedNumber = utils.convertNumberToWords(number)
  return dehydratedTrackName == number ||
    dehydratedTrackName == utils.dehydrateTitle(convertedNumber) ||
    console.error(`'${trackName}' does not match ${number} or '${convertedNumber}'`)
}

if (!playlist.every((t, i) => testTrackName(t.name, i + 1))) {
  throw new Error(`Validation has failed`)
}