/**
 * http server 服务配置
 */
const proxy = require('http-proxy-middleware')

const { dest_path } = require('./gulp.conf')

module.exports = {
  port: 3000,
  server: {
    baseDir: dest_path.dir,
    index: 'index.html'
  },
  middleware: [
    /* 
    proxy(['/api/v1'], {
      target: 'http://api.example.com',
      changeOrigin: true
    }),
    proxy('/mock/v1/', {
      target: 'http://192.168.1.100',
      changeOrigin: true
    })
     */
  ],
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
}