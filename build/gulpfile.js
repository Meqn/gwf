const gulp = require('gulp')
const argv = require('yargs').argv
const del = require('del')
const runSequence = require('run-sequence')
const gulpif = require('gulp-if')
const jEditor = require('gulp-json-editor')
const lazypipe = require('lazypipe')
const connect = require('gulp-connect')
const proxy = require('http-proxy-middleware')
const open = require('open')
const chalk = require('chalk')
const log = require('diy-log')

const plumber = require('gulp-plumber')
const eslint = require('gulp-eslint')
const rename = require('gulp-rename')
const concat = require('gulp-concat')
const replace = require('gulp-replace')
const sourcemaps = require('gulp-sourcemaps')
const rev = require('gulp-rev')
const revCollector = require('gulp-rev-collector')
const preprocess = require('gulp-preprocess-file')

const sass = require('gulp-sass')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const nano = require('cssnano')
const uglify = require('gulp-uglify')
const babel = require('gulp-babel')
const imagemin = require('gulp-imagemin')
const template = require('gulp-art-tpl')


/*******************************************************************************************
 * 配置
 */
const Utils = require('./gulp.util')
const CONFIG = require('./gulp.conf')
const isPROD = argv.prod // 是否生产环境
const isHASH = argv.hash // 是否启用文件hash版本
const SRC = CONFIG.src
const DIST = CONFIG.dist
const SRC_OPTION = {
  base: SRC.dir
}
const DIST_OPTION = {
  base: DIST.dir
}
const MANIFEST_PATH = `${DIST.dir}/manifest/`


/*******************************************************************************************
 * 管道任务
 */

/**
 * 处理 manifest转换管道任务(转换文件版本格式 rev)
 */
function manifestTask(name) {
  let task = lazypipe()
    .pipe(rev)
    .pipe(rev.manifest, `${name}_manifest.json`)
    .pipe(jEditor, function (file) {
      return Utils.transformHash(file)
    })
    .pipe(gulp.dest, MANIFEST_PATH)
  return task()
}
/**
 * 替换路径任务
 */
const pathTask = lazypipe()
  .pipe(replace, CONFIG.alias.root[1], CONFIG.alias.root[0])
  .pipe(replace, CONFIG.alias.asset[1], CONFIG.alias.asset[0])

/**
 * 错误信息处理
 */
function onError(error) {
  const { name, plugin, message } = error
  log.error(`${plugin} ${name} : ${message}`)
}

/*******************************************************************************************
 * 任务：启动本地HTTP 服务
 * 功能：HTTP服务, 代理, 热更新
 */
gulp.task('server', function () {
  var webServe = connect.server({
    name: 'web',
    host: '0.0.0.0',
    root: DIST.dir,
    port: CONFIG.port.dev,
    livereload: true,
    middleware: function (connect, opt) {
      return CONFIG.proxy.map(item => {
        return proxy(item.context, {
          target: item.target,
          changeOrigin: true
        })
      })
    }
  }, function () {
    const { https, host, port } = this
    let webUrl = `${https ? 'https' : 'http'}://${host}:${port}/`
    setTimeout(() => {
      open(webUrl)
    }, 1000)
    log.time(chalk.yellow('😀 :::::::::::::::::::::::::::::::::::::::: 😀'))
    log.time(`Open in browser : ${chalk.blue(webUrl)}`)
    log.time(chalk.yellow('😀 :::::::::::::::::::::::::::::::::::::::: 😀'))
  })
})


/*******************************************************************************************
 * 任务：copy无需处理的资源
 */
gulp.task('build:static', done => {
  gulp.src([SRC.public])
    .pipe(gulp.dest(DIST.asset))
    .pipe(connect.reload())
    .on('end', () => {
      done()
      log.time('🚀 . build public done ... ')
    })
})


/*******************************************************************************************
 * 任务：处理 image文件
 * 功能：压缩
 */
gulp.task('build:image', done => {
  gulp.src(SRC.image, SRC_OPTION)
    // .pipe(gulpif(isPROD, imagemin()))
    .pipe(gulp.dest(DIST.asset))
    .pipe(gulpif(isHASH, manifestTask('image')))
    .pipe(connect.reload())
    .on('end', () => {
      done()
      log.time('🚀 . build image done ... ')
    })
})


/*******************************************************************************************
 * 任务：处理 style文件
 * 功能：scss, 自动补全, 压缩, sourcemap
 */
gulp.task('build:style', done => {
  const plugins = [
    autoprefixer({
      browsers: CONFIG.pkg.browserslist
    })
  ]
  if (isPROD) {
    /** cssnano 使用
     * v4.0 以上预设环境，如下
     * plugins.push(nano({ preset: "default" }))
     * 
     * v4.0以下
     */
    plugins.push(nano({
      autoprefixer: false,
      discardUnused: false,
      mergeIdents: false,
      reduceIdents: false,
      zindex: false
    }))
  }
  gulp.src(SRC.style, SRC_OPTION)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(pathTask())
    .pipe(postcss(plugins))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(DIST.asset))
    .pipe(gulpif(isHASH, manifestTask('style')))
    .pipe(connect.reload())
    .on('end', () => {
      done()
      log.time('🚀 . build style done ... ')
    })
})


/*******************************************************************************************
 * 任务：处理 script文件
 * 功能：合并, 压缩, babel, sourcemap
 */
function handleScript(name, files) {
  return new Promise(resolve => {
    gulp.src(files, SRC_OPTION)
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(preprocess({
        env: isPROD ? 'production' : 'development'
      }))
      .pipe(concat(`scripts/${name}.js`))
      .pipe(pathTask())
      .pipe(babel({
        presets: ['env']
      }))
      .pipe(gulpif(isPROD, uglify()))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(DIST.asset))
      .pipe(connect.reload())
      .on('end', resolve)
  })
  
}

gulp.task('build:script', done => {
  let tasks = []
  const fileObj = SRC.scriptMap
  for (let name in fileObj) {
    let files = fileObj[name].map(item => `${SRC.dir}/scripts/${item}`)
    tasks.push(handleScript(name, files))
  }

  Promise.all(tasks).then(res => {
    done()
    log.time('🚀   build script complete ! ... ')
  })
})

gulp.task('build:script:hash', done => {
  gulp.src(`${DIST.asset}/scripts/**`, DIST_OPTION)
    .pipe(manifestTask('script'))
    .on('end', done)
})


/*******************************************************************************************
 * 任务：处理 html文件
 * 功能：替换, 文件版本控制, artTemplate模版渲染
 */
gulp.task('build:html', done => {
  let htmlArr = [SRC.html]
  if (isHASH) {
    htmlArr.push(`${MANIFEST_PATH}/*.json`)
  }
  gulp.src(htmlArr, { base: '' })
    .pipe(plumber())
    .pipe(preprocess({
      env: isPROD ? 'production' : 'development'
    }))
    .pipe(template({
      title: '前端开发工作流'
    }))
    .pipe(pathTask())
    .pipe(gulpif(isHASH, revCollector({
      revSuffix: '\\?[0-9a-f]{8,10}'
    })))
    .pipe(gulp.dest(DIST.dir))
    .pipe(connect.reload())
    .on('end', () => {
      done()
      log.time('🚀 . build html done ... ')
    })
})


/********************************************************************************************/

/**
 * 任务：监控文件
 */
gulp.task('watch', () => {
  gulp.watch(SRC.public, ['build:static'])
  gulp.watch(SRC.image, ['build:image'])
  gulp.watch(SRC.style, ['build:style'])
  gulp.watch(SRC.script, ['build:script'])
  gulp.watch(SRC.html, ['build:html'])
})

/**
 * 任务：lint
 */
gulp.task('lint', done => {
  gulp.src(SRC.script, SRC_OPTION)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
})

/**
 * 任务：删除已发布的文件
 */
gulp.task('clean', done => {
  return del([DIST.dir], {
    force: true
  }).then(paths => {
    log.time('Files be deleted: \n', paths.join('\n'))
  })
})

/**
 * 任务：发布站点
 */
gulp.task('build', ['clean'], taskDone => {
  runSequence(['build:static', 'build:image'], ['build:style', 'build:script'], () => {
    runSequence('build:html')
    taskDone()
    log.time(log.symbols.success, chalk.bgGreen('build success .... ✅ .'))
  })
})

// 默认任务
gulp.task('default', ['build'], () => {
  if (argv.watch) {
    gulp.start('watch');
  }
  if (argv.server) {
    gulp.start('server')
  }
})
