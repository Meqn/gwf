const { task, watch, src, dest, parallel, series } = require('gulp')
const del = require('del')
const log = require('diy-log')
const chalk = require('chalk')
const zip = require('gulp-zip')
// http server
const browserSync = require('browser-sync').create()
const reload = browserSync.reload
const proxy = require('http-proxy-middleware')

// 配置文件
const { ENV, isProd, isHash, src_path, dest_path, httpServe, pkg } = require('./build/gulp.conf')
// static, img, js, css, html任务
const { buildPublic, buildImage } = require('./build/gulp.static')
const buildStyle = require('./build/gulp.style')
const { buildScript, lint } = require('./build/gulp.script')
const buildHtml = require('./build/gulp.html')

// 环境
process.env.NODE_ENV = ENV

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
  browserSync.init({
    port: httpServe.port,
    server: {
      baseDir: dest_path.dir,
      index: 'index.html'
    },
    middleware: httpServe.proxy.map(v => {
      return proxy(v.context, {
        target: v.target,
        changeOrigin: true
      })
    }),
    // 是否开启多端操作同步 (镜像)
    ghostMode: {
      clicks: false,   // 点击
      forms: false,    // 表单
      scroll: false   // 滚动
    },
    // 是否自动打开浏览器
    open: 'external', //打开本地主机URL
    //不显示在浏览器中的任何通知
    notify: false
  }, cb)
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
  log(chalk.green(content))
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
