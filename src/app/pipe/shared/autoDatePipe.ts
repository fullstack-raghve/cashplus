export function createAutoCorrectedDatePipe(dateFormat = 'mm dd yyyy', max?: any, min?: any) {
    return function (conformedValue) {
      const indexesOfPipedChars = []
      const dateFormatArray = dateFormat.split(/[^dmyHMS]+/)
      const maxValue = max || { 'dd': 31, 'mm': 12, 'yy': 99, 'yyyy': 9999, 'HH': 23, 'MM': 59, 'SS': 59 }
      const minValue = min || { 'dd': 1, 'mm': 1, 'yy': 0, 'yyyy': 1, 'HH': 0, 'MM': 0, 'SS': 0 }
      const conformedValueArr = conformedValue.split('')
      var datePattern = dateFormat.split('').filter(t => t.trim())
      var result = ""
  
      dateFormatArray.forEach((format) => {
        const position = dateFormat.indexOf(format)
        const maxFirstDigit = parseInt(maxValue[format].toString().substr(0, 1), 10)
  
        if (parseInt(conformedValueArr[position], 10) > maxFirstDigit) {
          conformedValueArr[position + 1] = conformedValueArr[position]
          conformedValueArr[position] = 0
          indexesOfPipedChars.push(position)
        }
        var sub1 = conformedValueArr[position]
        var sub2 = conformedValueArr[position + 1]
        if (sub2) {
          sub2 = parseInt(sub2, 10)
        }
  
        var fullStringValue = ""
        if (sub1) {
          fullStringValue += `${sub1}`
        }
  
        if (sub2) {
          fullStringValue += `${sub2}`
        }
        var fullValue = parseInt(fullStringValue, 10)
        if (fullValue > maxValue[format]) {
          var stringValue = maxValue[format].toString()
          for (let i = 0; i < stringValue.length; i++) {
  
            var numberValue = stringValue[i]
            conformedValueArr[position + i] = numberValue
          }
  
          indexesOfPipedChars.push(position)
        }
      })
  
      const isInvalid = dateFormatArray.some((format) => {
        const position = dateFormat.indexOf(format)
        const length = format.length
        const textValue = conformedValueArr.join('').substr(position, length).replace(/\D/g, '')
        const value = parseInt(textValue, 10)
        return value > maxValue[format] || (textValue.length === length && value < minValue[format])
      })
  
      if (isInvalid) {
        return false
      }
  
      return {
        value: conformedValueArr.join(''),
        indexesOfPipedChars
      }
    }
  }