
## gulp-rev / gulp-rev-collector


- gulp-rev
  > 文件添加hash版本号  
  > https://github.com/sindresorhus/gulp-rev

- gulp-rev-collector
  > 修改html中静态资源链接，结合 gulp-rev  
  > https://github.com/shonny-ua/gulp-rev-collector


## Usage

```html
<!-- 方式一 [默认] -->
<link rel="stylesheet" href="/assets/css/comm.css?2c0d21e40c" />

<!-- 方式二 -->
<link rel="stylesheet" href="/assets/css/comm-2c0d21e40c.css" />
```


### 方式一

1. 转换 `gulp-rev` 默认生成的 `manifest.json` 文件，且不生成真实的hash文件。

```js
// 转换方法
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


// gulp 流程
gulp.src(['assets/css/*.css'], {base: 'assets'})
  .pipe(rev())
  .pipe(rev.manifest('css_manifest.json'))
  .pipe(jsonEditor, function(json) {  // 转换 manifest.json
    return transformHash(json)
  })
  .pipe(gulp.dest('build/assets'))  // write manifest to build dir
```

2. 修改 `gulp-rev-collector` 替换链接的规则

```js
gulp.src()
  .pipe(revCollector({
    revSuffix: '\\?[0-9a-f]{8,10}'
  }))
```



### 方式二

1. 使用 `gulp-rev` 生成 hash 文件 和对应的 `manifest.json` 文件

```js
// gulp 流程
gulp.src(['assets/css/*.css'], {base: 'assets'})
  .pipe(gulp.dest('build/assets'))  // copy original assets to build dir
  .pipe(rev())
  .pipe(gulp.dest('build/assets'))  // write rev'd assets to build dir
  .pipe(rev.manifest('css_manifest.json'))
  .pipe(gulp.dest('build/assets'))  // write manifest to build dir
```

2. 使用 `gulp-rev-collector` 替换文件链接

```js
gulp.src()
  .pipe(revCollector())     // 默认规则: '-[0-9a-f]{8,10}-?'
```




## 自定义

参考：
https://github.com/atamas101/gulp-rev-format

