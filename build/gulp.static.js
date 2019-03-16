/**
 * copy, image 处理任务
 */
const { src, dest } = require('gulp')
const plumber = require('gulp-plumber')
const gulpif = require('gulp-if')
const imagemin = require('gulp-imagemin')
const imageminPngquant = require('imagemin-pngquant')

const { taskManifest, onError } = require('./gulp.util')
const { src_path, dest_path } = require('./gulp.conf')

/**
 * 拷贝无需处理的文件
 */
function copyfiles() {
  return function(done) {
    return src([src_path.public])
      .pipe(plumber(onError))
      .pipe(dest(dest_path.asset))
      .on('end', done)
  }
}

/**
 * 处理图片文件
 */
function image({ isProd, isHash }) {
  return function(done) {
    return src(src_path.image, { base: src_path.dir })
      .pipe(plumber(onError))
      .pipe(gulpif(isProd, imagemin({
        interlaced: true,
        progressive: true,      // 无损压缩JPG图片
        optimizationLevel: 5,
        svgoPlugins: [
          {
            removeViewBox: false   // 不移除svg的viewbox属性
          }
        ],
        use: [imageminPngquant()]   // 使用pngquant插件进行深度压缩 png
      })))
      .pipe(dest(dest_path.asset))
      .pipe(gulpif(isHash, taskManifest('image')))
      .on('end', done)
  }
}

module.exports = function ({ isProd, isHash }) {
  return {
    buildPublic: copyfiles({ isProd, isHash }),
    buildImage: image({ isProd, isHash })
  }
}
