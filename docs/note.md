
## Todo

 * [ ] plumber 错误信息处理
 * [ ] npm run 文档说明
 * [ ] zip 压缩
 * [ ] webpack 处理JS
 * [ ] HTTP服务替换 browser-sync
 * [ ] Mock模拟数据
 * [ ] Eslint 配置
 * [ ] script.map循环任务使用 promise (bluebird)




## html

1. 模版引擎选择：
  - art-Template
  - Pug



## style

> 只编译 /^_/ 的.scss文件, 比如：about.scss，不会编译 _module.scss 文件

1. 选择预处理器
 - css (无)
 - scss
 - less



## script

1. webpack
2. map表 （entry 入口： entry.config.js）， 或在 package.js 增加字段
  - 参考：[推荐使用Promise (Bluebird)](https://ask.helplib.com/javascript/post_7547092)


## Asset

1. gulp-svgmin
2. //



## 注意点

### 1. 了解node中文件路径配置

> gulp内建的.src .dest .watch等方法，传入的文件路径的解析是通过glob这个模块处理的，所以可以先去了解下这个路径字串格式的配置方法，这样子对自由组织选取文件操作很有帮助。

```js
gulp.src('css/**/!(_)*'); //排除以_开头的文件
```


### 2. watch方法路径不要用 `./xx`

> 用 `./xx` 开头作为当前路径开始，会导致无法监测到新增文件，所以直接省略掉 `./` 即可。`./images/*' === 'images/*`



### 3. watch使用change事件来同步删除情况

> 网上看到的很多教程只有文件改变或者新增来自动处理这部分文件，但是删除了源文件，输出文件夹里的对应文件却没有相应的自动删除。其实可以通过change事件来检测删除情况。

```js
var watcher = gulp.watch('js/**/*.js', ['uglify','reload']);
watcher.on('change', function(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});
```

> `event.type==deleted` 时就可以对应处理删除情况



### 4. 使用gulp-plumber来捕获处理任务中的错误

> 在gulp的管道流任务处理中，如果某个环节出了错，会导致整个任务中断，包括watch任务，这很麻烦。所以gulp-plumber来了。

```js
var plumber = require('gulp-plumber');
var less= require('gulp-less');
 
gulp.src('./src/*.ext')
    .pipe(plumber())
    .pipe(less())
    .pipe(gulp.dest('./dist'));
```


### 5. 文件路径替换

> 可以在配置简化版，别名 aliase

  1. `/@ASSET@/` : 资源文件目录
  2. `/@ROOT@/` : 根目录
  3. `/@HOST@/` : 根链接

或

```js
cosnt alias = {
  __: '/',
  __css: '/static/styles',
  __img: '/static/images',
  __js: '/static/scripts'
}
```

  


## references

- https://github.com/gulpjs/gulp
- https://github.com/vincentSea/gulp-cli
- https://github.com/vincentSea/gulp-cli
- https://github.com/zqjimlove/html-scaffolds
- https://github.com/Tencent/tmt-workflow
- https://github.com/tumars/gulp-project-boilerplate
- https://github.com/doodlewind/legs
- https://github.com/yeoman/generator-webapp
- https://github.com/RodeyManager/gupack
- https://github.com/iRuxu/kaci

