/**
 * html 处理任务
 */
const { src, dest } = require('gulp')
const plumber = require('gulp-plumber')
const gulpif = require('gulp-if')

const preprocess = require('gulp-preprocess-file')
const template = require('gulp-art-tpl')
const revCollector = require('gulp-rev-collector')

const { taskReplace, onError } = require('./gulp.util')
const { src_path, dest_path, preprocessContext } = require('./gulp.conf')

/**
 * 处理 html文件
 * 功能：替换, 文件版本控制, artTemplate模版渲染
 */
function html({ isHash }) {
  return function(done) {
    let fileArr = [src_path.html]
    if (isHash) {
      fileArr.push(`${dest_path.manifest}/*.json`)
    }

    return src(fileArr, { base: '' })
      .pipe(plumber(onError))
      .pipe(preprocess(preprocessContext))
      .pipe(template({
        title: '前端工作流'
      }))
      .pipe(taskReplace())
      .pipe(gulpif(isHash, revCollector({
        revSuffix: '\\?[0-9a-f]{8,10}'
      })))
      .pipe(dest(dest_path.dir))
      .on('end', done)
  }
}

module.exports = html
