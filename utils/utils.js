// convert number to words

const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']
const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']

const convert_hundreds = num => {
  if (num > 99) {
    return ones[Math.floor(num / 100)] + ' hundred ' + convert_tens(num % 100)
  } else {
    return convert_tens(num)
  }
}

const convert_tens = num => {
  if (num < 10) return ones[num]
  else if (num >= 10 && num < 20) return teens[num - 10]
  else {
    return tens[Math.floor(num / 10)] + ' ' + ones[num % 10]
  }
}

const convertNumberToWords = num => convert_hundreds(num).trim()

// end conversion code

const dehydrateTitle = title => title
  .toLowerCase()
  .replace(/remastered|2\d{3}|19\d{2}/g, '')  // add any strings agreed to ignore here
  .replace(/\W/g, '')

module.exports = {
  convertNumberToWords,
  dehydrateTitle
}