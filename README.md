# Web Env Reader

### [中文文档](./README-CN.md)

## Install

``` shell
npm install cell-env
```

## Usage

### Basic Example

``` js
import Env from 'cell-env'

const env = Env({
  'some-item': 'string',
  'some-other-item': {}
})
```

### Default Value

``` js
import Env from 'cell-env'

const env = Env({
  'default-item': {
    def: 'foobar'
  }
})
```

### Format Value

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

### Protect Value

``` js
import Env from 'cell-env'

const env = Env({
  'some-protected-item': Env.protect('this is a protected value')
})
```

### Rewrite Value

The following ways:
* Set variables to urlQuery.
* Write to a specific global variable(default is `window.__env__`).

It should be noted that the priority of the urlQuery is higher than the global variable.

#### Use urlQuery

```
http://foobar.com?some-item=1&some-other-item=2
```

***urlQuery value default use `decodeURIComponent` to decode***

#### Use global variable

``` html
<script>
window.__env__ = {
  'some-item': 1,
  'some-other-item': 2
}
</script>
```
