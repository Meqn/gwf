
# QwebFlow

Gulp开发web页面的自动化构建任务

 - 本地服务器，HTTP代理，自动打开浏览器
 - Mock模拟数据
 - image: 压缩，hash
 - style: SCSS，自动前缀，压缩，hash
 - script:
 - html: 模版引擎


### 文件目录

```
├─Project                   // 项目根目录
│  ├─dist                   // 生成目录
│  ├─src                    // 源文件目录
│  │  ├─html                // html页面目录
│  │  ├─images              // 图片资源文件
│  │  ├─styles              // scss样式资源文件
│  │  │  ├─comm.scss        //
│  │  │  ├─page.scss        //
│  │  ├─scripts             // js资源文件
│  │  │  ├─script.map.js    // js文件打包地图文件
│  │  ├─fonts               // 字体资源文件
│  ├─docs                   // 文档目录
│  ├─plugins                // 插件目录
│  ├─gulpfile.js            //
│  ├─package.js             //
│  ├─README.md
└─
```