
# QwebFlow

Gulp开发web页面的自动化构建任务

 - 本地服务器，HTTP代理，热更新，自动打开浏览器
 - Mock模拟数据
 - image: 压缩
 - style: SCSS，自动前缀，压缩
 - script: Babel，合并，压缩
 - html: 模版引擎，资源文件Hash


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
