# 前端环境变量读取器（Web Env Reader）

## 安装

``` shell
npm install cell-env
```

## 使用

### 基本用法

``` js
import Env from 'cell-env'

const env = Env({
  'some-item': 'string',
  'some-other-item': {}
})
```

### 默认值

``` js
import Env from 'cell-env'

const env = Env({
  'default-item': {
    def: 'foobar'
  }
})
```

### 后处理

``` js
import Env from 'cell-env'

const env = Env({
  'some-item': {
    fit: value => 'value: ' + value
  },
  'some-other-item': {
    def: 'default-value',
    fit: (v, ctx) => {
      return `self value: ${v}, some-item value: ${ctx['some-item']}`
    }
  }
})
```

### 变量保护

``` js
import Env from 'cell-env'

const env = Env({
  'some-protected-item': Env.protect('this is a protected value')
})
```

### 修改环境变量

如下几种方式:
* 写到url参数中.
* 写到特定全局变量(默认为`window.__env__`)的字段中.

其中, url参数的优先级高于全局变量.

#### 使用URL参数

```
http://foobar.com?some-item=1&some-other-item=2
```

***url变量默认使用`decodeURIComponent`进行解码***

#### 使用全局变量

``` html
<script>
window.__env__ = {
  'some-item': 1,
  'some-other-item': 2
}
</script>
```
