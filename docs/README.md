
# gulp-template

https://github.com/doodlewind/legs/blob/master/README.md

## Features

1. 资源文件版本号

```html
<!-- 默认 -->
<link rel="stylesheet" href="/assets/css/comm.css?2c0d21e40c" />

<!-- 也可以修改为 -->
<link rel="stylesheet" href="/assets/css/comm-2c0d21e40c.css" />
```

2. HTML模版引擎

```
```


## Usage

1. 文件目录

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


## File structure



## plugins


- yargs
  > 参数配置  
  > https://github.com/yargs/yargs

- del
  > 删除文件和目录  
  > https://github.com/sindresorhus/del

- gulp-if
  > if 条件判断  
  > https://github.com/robrich/gulp-if

- run-sequence
  > 按顺序执行任务列表  
  > https://github.com/OverZealous/run-sequence

- gulp-connect
- http-proxy-middleware


### utils

- gulp-rename
- gulp-replace
- gulp-concat

- gulp-sourcemaps

- gulp-rev
  > 文件添加hash版本号  
  > https://github.com/sindresorhus/gulp-rev

- gulp-rev-collector
  > 修改html中静态资源链接，结合 gulp-rev  
  > https://github.com/shonny-ua/gulp-rev-collector

- gulp-tap
  > 控制管道  
  > https://github.com/geejs/gulp-tap

- gulp-data
  > //  
  > https://github.com/colynb/gulp-data


### style

- gulp-postcss
- autoprefixer
- cssnano
  > 压缩css  
  > http://cssnano.co/

- gulp-sass

```bash
# gulp-postcss, autoprefixer, cssnano, gulp-sourcemaps

var gulp = require('gulp');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var sourcemaps = require('gulp-sourcemaps')

gulp.task('css', function () {
    var plugins = [
        autoprefixer({browsers: ['last 1 version']}),
        cssnano()
    ];
    return gulp.src('./src/*.css')
        .pipe(sourcemaps.init())
          .pipe(postcss(plugins))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dest'));
});

```

### script

- gulp-uglify

- gulp-babel
  > https://github.com/babel/gulp-babel

`npm install --save-dev gulp-babel babel-core babel-preset-env`

```bash
const gulp = require('gulp');
const babel = require('gulp-babel');

gulp.task('default', () =>
  gulp.src('src/app.js')
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(gulp.dest('dist'))
)
```


### images

- gulp-imagemin
  > 图片压缩  
  > https://github.com/sindresorhus/gulp-imagemin

- sprity
  > 雪碧图
  > https://github.com/sprity/sprity

### html

- gulp-htmlmin
  > 压缩html文件
  > https://github.com/jonschlinkert/gulp-htmlmin

- gulp-file-include
  > 引入文件(模版引擎)  
  > https://github.com/coderhaoxin/gulp-file-include



## other

1. 文件版本号
```html
<link rel="stylesheet" href="/assets/css/common-2c0d21e40c.css" />

<!-- 模式修改为 -->

<link rel="stylesheet" href="/assets/css/common.css?2c0d21e40c" />
```


