export default function serializeFormData (form) {
  const sorted = []
  for (const uid in form) {
    if (form.hasOwnProperty(uid)) {
      sorted.push([uid, form[uid].index])
    }
  }
  sorted.sort((a, b) => {
    return a[1] - b[1]
  })

  const serialized = []

  for (const formData of sorted) {
    const data = form[formData[0]]

    const tmpObject = {
      type: data.fieldType,
      name: data.fieldName,
      rule: data.fieldRule === 'repeated' ? 'repeated' : undefined,
      values: data.enumValue
    }
    serialized.push(tmpObject)
  }

  return serialized
}
