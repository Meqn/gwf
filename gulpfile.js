const gulp = require('gulp')
const path = require('path')
const argv = require('yargs').options({
  p: {
    alias: 'port',
    type: 'number'
  },
  w: {
    alias: 'watch',
    type: 'boolean'
  },
  s: {
    alias: 'server',
    type: 'boolean'
  }
}).argv

const del = require('del')
const runSequence = require('run-sequence')
const gulpif = require('gulp-if')
const tap = require('gulp-tap')
const gData = require('gulp-data')
const jEditor = require('gulp-json-editor')
const lazypipe = require('lazypipe')
const connect = require('gulp-connect')
const proxy = require('http-proxy-middleware')

const rename = require('gulp-rename')
const concat = require('gulp-concat')
const replace = require('gulp-replace')
const sourcemaps = require('gulp-sourcemaps')
const rev = require('gulp-rev')
const revCollector = require('gulp-rev-collector')

const sass = require('gulp-sass')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const nano = require('cssnano')
const uglify = require('gulp-uglify')
const babel = require('gulp-babel')
const imagemin = require('gulp-imagemin')
const sprity = require('sprity')
const includer = require('gulp-file-include')
const htmlmin = require('gulp-htmlmin')
const htmltpl = require('gulp-html-tpl')
const artTemplate = require('art-template')


const pkg = require('./package.json')
const script_files = require('./src/scripts/script.map')
const static_files = [
  'src/fonts/**',
  'src/libs/**'
]

const OPTION = { base: 'src' }
const ROOT_PATH = '/'
const ASSETS_PATH = '/assets/'
const ASSETS_DIR = 'assets'
const DIST_DIR = 'dist'
const MANIFEST_PATH = `${DIST_DIR}/manifest/`

const PORT = argv.p || 3000
const PROD = argv.prod
const HASH = argv.hash

/**
 * 转换文件 hash 方式
 * 将 comm-2c0d21e40c.css 转换为 comm.css?2c0d21e40c
 * revSuffix: '-[0-9a-f]{8,10}-?' , '\\?[0-9a-f]{8,10}'
*/
const manifestJSON = {}
function transformHash (json) {
  let newObj = {}
  for (const key in json) {
    if (json.hasOwnProperty(key)) {
      // let hash = json[key].split('/').pop().split('-')[1].split('.')[0]
      let hash = path.basename(json[key]).split('-')[1].split('.')[0]
      newObj[key] = key + '?' + hash
    }
  }
  return newObj
}

/**
 * 处理 manifest转换管道任务
*/
let manifestTask = lazypipe()
  .pipe(jEditor, function (file) {
    return transformHash(file)
  })
  .pipe(gulp.dest, MANIFEST_PATH)

/**
 * 启动本地服务器
 * 功能：HTTP服务, 代理, 自动更新
 */
gulp.task('server', function () {
  connect.server({
    name: 'web',
    host: '0.0.0.0',
    root: DIST_DIR,
    port: PORT,
    livereload: true,
    middleware: function (connect, opt) {
      return [
        proxy(['/api/v1/'], {
          target: 'http://api.test.com',
          changeOrigin: true
        }),
        proxy('/mock/v1', {
          target: 'http://192.168.1.100',
          changeOrigin: true
        })
      ]
    }
  })
})

/**
 * 复制不需要处理的资源文件
 */
gulp.task('build:assets', () => {
  return gulp.src(static_files, OPTION)
    .pipe(gulp.dest(`${DIST_DIR}/${ASSETS_DIR}/`))
    .pipe(connect.reload())
})

/**
 * 处理 image 文件
 * 功能：压缩
 */
gulp.task('build:image', (done) => {
  gulp.src('src/images/**', OPTION)
    .pipe(gulpif(PROD, imagemin()))
    .pipe(gulp.dest(`${DIST_DIR}/${ASSETS_DIR}/`))
    .pipe(connect.reload())
    .on('end', () => {
      done()
      console.log('🚀 . build image done ... ')
    })
})
gulp.task('build:image:hash', (done) => {
  gulp.src(`${DIST_DIR}/${ASSETS_DIR}/images/**`, { base: DIST_DIR })
    .pipe(rev())
    .pipe(rev.manifest('image_manifest.json'))
    // .pipe(gulp.dest(MANIFEST_PATH))
    .pipe(manifestTask())
    .on('end', done)
})

/**
 * 处理 style 文件
 * 功能：scss, 自动补全, 压缩, sourcemap
 */
gulp.task('build:style', (done) => {
  const plugins = [
    autoprefixer({ browsers: pkg.browserslist })
  ]
  if (PROD) {
    plugins.push(nano({ preset: "default" }))
  }
  gulp.src('src/styles/*.scss', OPTION)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(replace('/@/', ROOT_PATH))
    .pipe(replace('/@@/', ASSETS_PATH))
    .pipe(postcss(plugins))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(`${DIST_DIR}/${ASSETS_DIR}/`))
    .pipe(connect.reload())
    .on('end', () => {
      done()
      console.log('🚀 . build style done ... ')
    })
})
gulp.task('build:style:hash', (done) => {
  gulp.src(`${DIST_DIR}/${ASSETS_DIR}/styles/**`, { base: DIST_DIR })
    .pipe(rev())
    .pipe(rev.manifest('style_manifest.json'))
    .pipe(manifestTask())
    .on('end', done)
})

/**
 * 处理 script 文件
 * 功能：合并, 压缩, babel, sourcemap
 */
gulp.task('build:script', (done) => {
  let count = 0, sFiles = Object.keys(script_files)

  sFiles.map((file, key) => {
    let files = script_files[file].map(item => `src/scripts/${item}`)
    gulp.src(files, OPTION)
      .pipe(sourcemaps.init())
      .pipe(concat(`scripts/${file}.js`))
      .pipe(replace('/@/', ROOT_PATH))
      .pipe(replace('/@@/', ASSETS_PATH))
      .pipe(babel({
        presets: ['env']
      }))
      .pipe(gulpif(PROD, uglify()))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(`${DIST_DIR}/${ASSETS_DIR}/`))
      .pipe(connect.reload())
      .on('end', () => {
        count++
        if (count === sFiles.length) {
          done()
          console.log('🚀 . build script done ... ')
        }
      })
  })
})
gulp.task('build:script:hash', (done) => {
  gulp.src(`${DIST_DIR}/${ASSETS_DIR}/scripts/**`, { base: DIST_DIR })
    .pipe(rev())
    .pipe(rev.manifest('script_manifest.json'))
    .pipe(manifestTask())
    .on('end', done)
})

/**
 * 处理 html 文件
 * 功能：替换, 版本控制, 模版渲染
 */
gulp.task('build:html', () => {
  let htmlArr = ['src/html/**']
  if (HASH) {
    htmlArr.push(`${MANIFEST_PATH}/*.json`)
  }
  gulp.src(htmlArr, { base: '' })
    .pipe(htmltpl({
      tag: 'template',
      dataTag: 'data',
      engine (template, data) {
        return artTemplate.compile(template)(data)
      },
      data: {}
    }))
    .pipe(replace('/@/', ROOT_PATH))
    .pipe(replace('/@#/', ASSETS_PATH))
    .pipe(revCollector({
      revSuffix: '\\?[0-9a-f]{8,10}'
    }))
    .pipe(gulp.dest(DIST_DIR))
    .pipe(connect.reload())
})

/**
 * 删除已发布的文件
 */
gulp.task('clean', (done) => {
  return del([MANIFEST_PATH, DIST_DIR]).then(paths => {
    console.log('clean files: \n', paths.join('\n'))
  })
})

/**
 * 发布站点
 */
gulp.task('build', ['clean'], () => {
  let buildTask = ['build:assets', 'build:image', 'build:style', 'build:script']
  let hashTask = ['build:image:hash', 'build:style:hash', 'build:script:hash']
  let htmlTask = ['build:html']
  if (PROD && HASH) {
    return runSequence(...buildTask, ...hashTask, ...htmlTask)
  } else {
    return runSequence(...buildTask, ...htmlTask)
  }
})

/**
 * 监控文件变化
 */
gulp.task('watch', () => {
  gulp.watch(static_files, ['build:assets'])
  gulp.watch(['src/images/**'], ['build:image'])
  gulp.watch('src/styles/**', ['build:style'])
  gulp.watch('src/scripts/**', ['build:script'])
  gulp.watch('src/html/**', ['build:html'])
})

gulp.task('default', ['build'], () => {
  if (argv.w) {
    gulp.start('watch');
  }
  if (argv.s) {
    gulp.start('server')
  }
})
