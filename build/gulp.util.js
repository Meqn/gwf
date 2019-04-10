/**
 * gulp 工具集
 */
const path = require('path')
const { dest } = require('gulp')
const log = require('diy-log')
const lazypipe = require('lazypipe')
const jEditor = require('gulp-json-editor')
const rev = require('gulp-rev')
const replace = require('gulp-replace')

const { dest_path, alias } = require('./gulp.conf')

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

/**
 * 处理 manifest转换管道任务(转换文件版本格式 rev)
 */
function taskManifest(name) {
  let task = lazypipe()
    .pipe(rev)
    .pipe(rev.manifest, `${name}_manifest.json`)
    .pipe(jEditor, function (file) {
      return transformHash(file)
    })
    .pipe(dest, dest_path.manifest)
  
  return task()
}

/**
 * 替换路径任务
 */
/* 
const taskReplace = lazypipe()
  .pipe(replace, alias.root[0], alias.root[1])
  .pipe(replace, alias.asset[0], alias.asset[1])
 */
const taskReplace = (function() {
  let stream = lazypipe()
  for (const key in alias) {
    stream = stream.pipe(replace, key, alias[key])
  }
  return stream
}())

/**
 * 错误信息处理
 */
function onError(error) {
  const { name, plugin, message } = error
  log.error(`${plugin} ${name} : ${message}`)
}

module.exports = {
  taskManifest,
  taskReplace,
  onError
}
