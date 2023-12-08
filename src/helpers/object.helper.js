export function toFormData(target) {
  let formData = new FormData();
  createFormData(formData, target, null);
  return formData;
}

function createFormData(formData, data, previousKey) {
  for (let [key, value] of Object.entries(data)) {
    if (value instanceof Blob) {
      if (previousKey) key = `${previousKey}[${key}]`;
      formData.append(key, value);
      continue;
    }

    if (value instanceof Object && !Array.isArray(value)) {
      return createFormData(formData, value, key);
    }

    if (Array.isArray(value)) {
      for (let [index, val] of value.entries()) {
        if (val instanceof Blob) {
          let newKey = `${previousKey}[${key}][${index}][file]`;
          formData.append(newKey, val);
          continue;
        }

        if (val instanceof Object) {
          let keyIndex = `${key}[${index}]`;
          createFormData(formData, val, keyIndex);
          continue;
        }

        let newKey = `${key}[${index}]`;
        formData.append(newKey, val);
        continue;
      }
    } else {
      if (previousKey) key = `${previousKey}[${key}]`;
      formData.append(key, value);
    }
  }
}

export function excludeEmpty(obj) {
  const result = {};
  for (let key in obj) {
    if (obj[key] != null && obj[key] != '') result[key] = obj[key];
  }
  return result;
}

export function convertUTC(value) {
  const date = new Date(value);
  date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
  return date;
}
