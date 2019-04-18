const capDecimals = (num, cap = 8, maxLen = 8) => {
  let stringified
  if (typeof num !== 'string') {
    stringified = num.toString()
  } else stringified = num
  let splitted = stringified.split('.')
  if (!splitted[1]) {
    return parseFloat(splitted[0])
  }
  if (splitted[1].length > maxLen) {
    let capped = splitted[1].slice(0, cap)
    let finished = `${splitted[0]}.${capped}`
    return parseFloat(finished)
  } else {
    return parseFloat(num)
  }
}

export default capDecimals
