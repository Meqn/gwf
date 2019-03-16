const { task, watch, src, dest, parallel, series } = require('gulp')
const yargs = require('yargs').argv
const del = require('del')
const log = require('diy-log')
const chalk = require('chalk')
const zip = require('gulp-zip')
// http server
const browserSync = require('browser-sync').create()
const reload = browserSync.reload
const httpConfig = require('./build/server')
// 环境
process.env.NODE_ENV = yargs.env || 'development'
const isProd = yargs.env === 'production' ? true : false
const isHash = !!yargs.hash

// 配置文件
const { src_path, dest_path, pkg } = require('./build/gulp.conf')
// static, img, js, css, html任务
const { buildPublic, buildImage } = require('./build/gulp.static')({ isProd, isHash })
const buildStyle = require('./build/gulp.style')({ isProd, isHash })
const { buildScript, lint } = require('./build/gulp.script')({ isProd, isHash })
const buildHtml = require('./build/gulp.html')({ isProd, isHash })

// ❌ 清除打包文件
task('clean', done => {
  return del([dest_path.dir], {
    force: true
  }).then(paths => {
    done()
    log.time('Files be deleted: \n', paths.join('\n'))
  })
})

// 📦 压缩打包文件
task('zip', () => {
  return src([`${dest_path.dir}/**`])
    .pipe(zip(`${pkg.name}-${pkg.version}.zip`))
    .pipe(dest(dest_path.dir))
})

// 👀 监视文件
task('watch', done => {
  watch(src_path.public, parallel('public')).on('change', reload)
  watch(src_path.image, parallel('image')).on('change', reload)
  watch(src_path.style, parallel('style')).on('change', reload)
  watch(src_path.script, parallel('script')).on('change', reload)
  watch(src_path.html, parallel('html')).on('change', reload)
  done()
})

// 👻 http服务
task('server', (cb) => {
  browserSync.init(httpConfig, cb)
})

// 🤖 帮助文档
function help(done) {
  const content = `
  ---------------------------------------
    开发环境    npm run dev
    生产环境    npm run build
    任务列表    gulp --tasks
    执行压缩    gulp zip
  ---------------------------------------`
  console.log(chalk.green(content))
  done()
}

task('public', buildPublic)
task('image', buildImage)
task('style', buildStyle)
task('script', buildScript)
task('lint', lint)
task('html', buildHtml)
task('build', series('clean', parallel('public', 'image'), parallel('style', 'script'), 'html'))
exports.develop = series('build', parallel('server', 'watch'))
exports.default = help
