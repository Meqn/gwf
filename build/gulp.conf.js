const pathResolve = require('./gulp.util').resolve
const pkg = require(pathResolve('package.json'))

// 源目录
const src_name = 'src'
// 目标目录
const dest_name = 'dist'
// 本地 HTTP服务端口
const port = {
  dev: 3010,
  mock: 3012
}
// 本地 HTTP服务代理
const proxy = [{
  context: ['/api/v1'],
  target: 'http://api.example.com'
}, {
  context: '/mock/v1/',
  target: 'http://192.168.1.100'
}]

const src_dir = pathResolve(src_name)
const scriptMap = require(pathResolve(`${src_name}/scripts/vendor.map`))
const src = {
  dir: src_dir,
  public: pathResolve('public/**'),
  html: `${src_dir}/html/**/*.html`,
  image: `${src_dir}/images/**`,
  style: `${src_dir}/styles/*.scss`,
  script: `${src_dir}/scripts/**`,
  scriptMap: scriptMap
}
const dist = {
  dir: pathResolve(dest_name),
  asset: pathResolve(`${dest_name}/static`)
}

// 路径替换别名
const alias = {
  root: ['/', '/@/'],
  asset: ['/static/', '/@@/']
}


module.exports = {
  src,
  dist,
  pkg,
  port,
  alias,
  proxy
}