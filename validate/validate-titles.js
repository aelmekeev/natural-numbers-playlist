/**
 * Note: this validation currently supports only number up to 99
 */

const fs = require('fs')

// convert number to words

const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];

const convert_hundreds = num => {
  if (num > 99) {
    return ones[Math.floor(num / 100)] + ' hundred ' + convert_tens(num % 100);
  } else {
    return convert_tens(num);
  }
}

const convert_tens = num => {
  if (num < 10) return ones[num];
  else if (num >= 10 && num < 20) return teens[num - 10];
  else {
    return tens[Math.floor(num / 10)] + ' ' + ones[num % 10];
  }
}

convertNumberToWords = num => convert_hundreds(num).trim()

// end conversion code

let root = process.env.GITHUB_WORKSPACE

const data = fs.readFileSync(`${root}/playlist.json`, 'utf8')
const playlist = JSON.parse(data)

const testTrackName = (trackName, number) => {
  trimmedTrackName = trackName
    .toLowerCase()
    .replace(/remastered|2\d{3}|19\d{2}/g, '')    // add any strings agreed to ignore
    .replace(/\W/g, '')
  convertedNumber = convertNumberToWords(number)
  return trimmedTrackName == number ||
    trimmedTrackName == convertedNumber.replace(/\W/g, '') ||
    console.error(`'${trackName}' does not match ${number} or '${convertedNumber}'`)
}

if (!playlist.every((t, i) => testTrackName(t.name, i + 1))) {
  throw new Error(`Validation has failed`)
}