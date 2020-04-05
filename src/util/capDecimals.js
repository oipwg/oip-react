const capDecimals = (num, cap = 8, maxLen = 8) => {
  let stringified
  if (typeof num !== 'string') {
    stringified = num.toString()
  } else stringified = num
  const splitted = stringified.split('.')
  if (!splitted[1]) {
    return parseFloat(splitted[0])
  }
  if (splitted[1].length > maxLen) {
    const capped = splitted[1].slice(0, cap)
    const finished = `${splitted[0]}.${capped}`
    return parseFloat(finished)
  } else {
    return parseFloat(num)
  }
}

export default capDecimals
