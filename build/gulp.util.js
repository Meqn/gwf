const path = require('path')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

/**
 * 转换文件 hash 方式
 */
function transformHash(json) {
  let newObj = {}
  for (const key in json) {
    if (json.hasOwnProperty(key)) {
      let hash = path.basename(json[key]).split('-').pop().split('.')[0]
      newObj[key] = key + '?' + hash
    }
  }
  return newObj
}

module.exports = {
  resolve,
  transformHash
}