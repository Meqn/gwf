
# gwf

> gulp workflow

Gulp开发web页面的自动化构建任务

 - 本地服务器，HTTP代理，热更新，自动打开浏览器
 - Mock模拟数据
 - image: 压缩
 - style: SCSS，自动前缀，压缩
 - script: Babel，合并，压缩
 - html: 模版引擎，资源文件Hash


## 环境要求

```
node.js >= 8.0
gulp >= 4.0
babel >= 7.0
```



## Todo

- [ ] template: ejs、pug
- [ ] htmlmin
- [ ] mock



## 文件目录

参考：https://zhuanlan.zhihu.com/p/21312474


```
├─Project
│  ├─docs                   // 文档
│  ├─public                 // 静态资源
│  │  ├─vendor              // 公共vendor
│  │  ├─font
│  ├─mock                   // 模拟数据
│  ├─dist                   // 生成目录
│  ├─src                    // 源文件
│  │  ├─html                // html页面目录
│  │  ├─images              // 图片资源文件
│  │  ├─styles              // scss样式资源文件
│  │  │  ├─comm.scss        //
│  │  │  ├─page.scss        //
│  │  ├─scripts             // js资源文件
│  │  │  ├─script.map.js    // js文件打包地图文件
│  │  ├
│  ├─gulpfile.js            // gulp配置
│  ├─package.js             // package.json
│  ├─.babelrc               // babel-loader 配置
│  ├─.gitignore                 // git 忽略项
│  ├─README.md
└─
```



## plugins

```
# base
npm install --save-dev autoprefixer chalk cssnano del diy-log gulp gulp-art-tpl gulp-concat gulp-connect gulp-eslint gulp-if gulp-imagemin gulp-json-editor gulp-plumber gulp-postcss gulp-preprocess-file gulp-rename gulp-replace gulp-rev gulp-rev-collector gulp-sass gulp-sourcemaps gulp-uglify http-proxy-middleware lazypipe open run-sequence yargs

# babel
npm install --save-dev gulp-babel@next @babel/core @babel/preset-env
```
