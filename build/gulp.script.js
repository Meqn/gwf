/**
 * javascript 处理任务
 */
const { src, dest } = require('gulp')
const plumber = require('gulp-plumber')
const gulpif = require('gulp-if')

const uglify = require('gulp-uglify')
const babel = require('gulp-babel')
const concat = require('gulp-concat')
const preprocess = require('gulp-preprocess-file')
const eslint = require('gulp-eslint')
const stripDebug = require('gulp-strip-debug')

const { taskManifest, taskReplace, onError } = require('./gulp.util')
const { isProd, isHash, src_path, dest_path, preprocessContext, pathResolve } = require('./gulp.conf')
// js入口文件，相对 src/scripts/ 目录
const entry = require('./entry.script')

/**
 * 处理 script文件
 * 功能：合并, 压缩, babel, sourcemap
 * 
 * @param {String} name 输出的文件名
 * @param {Array} files 源文件
 */
function handleScript(name, files) {
  return new Promise(resolve => {
    src(files, { base: src_path.dir, sourcemaps: true })
      .pipe(plumber(onError))
      .pipe(preprocess(preprocessContext))
      .pipe(concat(`scripts/${name}.js`))
      .pipe(taskReplace())
      .pipe(babel({
        presets: ['@babel/preset-env']
      }))
      .pipe(gulpif(isProd, uglify()))
      .pipe(dest(dest_path.asset, { sourcemaps: '.' }))
      .on('end', resolve)
  })
}
// 是否加入 hash版本号
function scriptHash(done) {
  return src(`${dest_path.asset}/scripts/**`, dest_path.dir)
    .pipe(taskManifest('script'))
    .on('end', done)
}

function script(done) {
  let tasks = []
  for (const name in entry) {
    const files = entry[name].map(item => `${src_path.dir}/scripts/${item}`)
    tasks.push(handleScript(name, files))
  }
  return Promise.all(tasks).then(res => {
    if (isHash) {
      scriptHash(done)
    } else {
      done()
    }
  })
}

// eslint
function lint(done) {
  return src(src_path.script)
    .pipe(plumber(onError))
    .pipe(gulpif(isProd, stripDebug()))
    .pipe(eslint({
      configFile: pathResolve('./.eslintrc.js')
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .on('end', done)
}

module.exports = {
  buildScript: script,
  lint: lint
}
