/**
 * css 处理任务
 */
const { src, dest } = require('gulp')
const plumber = require('gulp-plumber')
const gulpif = require('gulp-if')

const sass = require('gulp-sass')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')

const { taskManifest, taskReplace, onError } = require('./gulp.util')
const { isProd, isHash, src_path, dest_path } = require('./gulp.conf')


/** cssnano 用法
 * https://github.com/cssnano/cssnano
 * 
 * gulp4.0
 cssnano({
  preset: 'default'
})
 * 
 * gulp4.0 以下
 cssnano({
  autoprefixer: false,
  discardUnused: false,
  mergeIdents: false,
  reduceIdents: false,
  zindex: false
})
 */


/**
 * 处理 style文件
 * 功能：scss, 自动补全, 压缩, sourcemap
 */
function style(done) {
  const plugins = [
    autoprefixer()
  ]
  if (isProd) {
    plugins.push(cssnano({
      preset: 'default'
    }))
  }
  return src(src_path.style, { base: src_path.dir, sourcemaps: true })
    .pipe(plumber(onError))
    .pipe(sass().on('error', sass.logError))
    .pipe(taskReplace())
    .pipe(postcss(plugins))
    .pipe(dest(`${dest_path.asset}`, { sourcemaps: '.' }))
    .pipe(gulpif(isHash, taskManifest('style')))
    .on('end', done)
}

module.exports = style
