/**
 * gulp 全局配置文件
 */
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

// package.json 文件
const pkg = require(resolve('package.json'))
// 源文件目录
const src_dir = resolve('src')
// 目标文件目录
const dest_dir = resolve('dist')
// 源文件路径
const src_path = {
  dir: src_dir,
  public: resolve('public/**'),
  html: `${src_dir}/views/**/*.html`,
  image: `${src_dir}/images/**/*.{png,jpg,gif,svg,jpeg}`,
  style: `${src_dir}/styles/**`,
  script: `${src_dir}/scripts/**/*.{js,mjs}`,
}
// 目标文件路径
const dest_path = {
  dir: dest_dir,
  asset: `${dest_dir}/static`,
  manifest: `${dest_dir}/manifest`
}
// 替换别名
const alias = {
  '/@/': '/',
  '/@@/': '/static/',
  __root: '/',
  __asset: '/static',
  __css: '/static/styles',
  __img: '/static/images',
  __js: '/static/scripts'
}

// 全局上下文变量
const preprocessContext = {
  env: 'production'
}

module.exports = {
  pathResolve: resolve,
  src_path,
  dest_path,
  alias,
  pkg,
  preprocessContext
}
