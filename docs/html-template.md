
## art-Template

https://github.com/aui/art-template



## gulp-html-tpl

https://github.com/HaoyCn/gulp-html-tpl


## 使用

### 示例

1. 安装

`yarn add -D gulp-html-tpl art-template`

2. gulp配置

gulpfile.js

```bash
const gulp = require('gulp');
const htmltpl = require('gulp-html-tpl');
const artTemplate = require('art-template');

gulp.task('default', function() {
	return gulp.src('html/index.html')
		.pipe(htmltpl({
			tag: 'template',
			paths: ['./html'],
			engine: function(template, data) {
				return artTemplate.compile(template)(data)
			},
			data: {
				useHeader: false
			},
			beautify: {
				indent_char: ' ',
				indent_with_tabs: false
			}
		}))
		.pipe(gulp.dest('./dist'));
});
```

配置参数如下：
- tag 引入模板的标签，默认为字符串 template
- paths 字符串或数组，定义跨目录查找的目录路径
- engine 模板渲染引擎函数
- data 模板渲染的初始数据
- beautify HTML美化参数，传递给 js-beautify 插件
- dataTag本页默认数据标记标签 （本页默认数据在渲染本页面之前以 eval() 执行并获得）
- log 错误信息打印函数，值为 false 时不打印



3. html页面

html/index.html

```html
<body>
  <template src="./includes/header.html" text="index footer"></template>
  <main>
    index content ...
  </main>
  <template src="./includes/footer.html" text="index footer"></template>
<body>
```

html/includes/header.html

```html
<header>
  {{text}}
</header>
```


### 模版数据

模板中的数据共三种来源：

  1. 在 gulp 中配置 data 项作为初始数据
  2. 在模板标签中配置属性
  3. 本页默认数据标签，如（当配置项 dataTag 值为 data 时）

1. 配置属性 demo:

```html
<template src="header.html" text="header content">
{
	"name": "Jhon",
  "count": 2,
  "show": true
}
</template>
```

解析后得到如下数据：

```js
{
  src: 'header.html',
  text: 'header content',
  name: 'Jhon',
  count: 2,
  show: true
}
```

属性解析规则： ​
- false 和 true 被视为 Boolean 类型
- 数字字符串被视为 Number 类型
- 如果属性无值，则值为 String 类型的属性名


2. 本页默认数据

```html
<!-- 本页数据优先于页面被执行获得 -->
<data>{
  fav: "philosophy"
}</data>
<!-- 当页即可开始使用此变量进行模板编译 -->
<template src="book/${fav}.html"></template>
```

**注意：**

> 数据传递，从初始数据到父模板，再到子模板，优先级是：标签内容数据 > 标签属性 > 继承数据 > 本页默认数据。



### art-Template 语法

1. 输出：

```js
{{value}}
{{data.key}}
{{data['key']}}
{{a ? b : c}}
{{a || b}}
{{a + b}}
{{$data['user list']}}

// html 输出
{{@ value }}
```


2. 条件

```js
{{if value}} ... {{/if}}
{{if v1}} ... {{else if v2}} ... {{/if}}
```


3. 循环

```js
{{each target}}
    {{$index}} {{$value}}
{{/each}}
```


