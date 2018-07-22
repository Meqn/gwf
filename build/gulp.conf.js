const pathResolve = require('./gulp.util').resolve
const pkg = require(pathResolve('package.json'))
const src_name = 'src'
const dest_name = 'dist'
const port = {
  dev: 3010,
  mock: 3012
}

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
const alias = {
  root: ['/', '/@/'],
  asset: ['/static/', '/@@/']
}
module.exports = {
  src,
  dist,
  pkg,
  port,
  alias
}