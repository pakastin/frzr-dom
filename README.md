# FRZR-dom
render [FRZR](https://frzr.js.org) on server side

## installation
```
npm install frzr-dom
```

## usage
```js
var render = require('frzr-dom').render;

...

console.log(render(document.body));
```
- Requiring `frzr-dom` will create a fake DOM for [FRZR](https://frzr.js.org).
- You can then use `render(view)` or `render(el)` to produce HTML. That's it!
