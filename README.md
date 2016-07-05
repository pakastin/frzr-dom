# FRZR-dom
render [FRZR](https://frzr.js.org) on server side

## installation
```
npm install frzr-dom
```

## usage
```js
var Document = require('frzr-dom').Document;
var render = require('frzr-dom').render;

...
var document = new Document();
console.log(render(document.body, el('h1', 'Hello world!'))); --> <body><h1>Hello world!</h1></body>
```
- Requiring `frzr-dom` will create a fake DOM for [FRZR](https://frzr.js.org).
- You can then use `render(view)` or `render(el)` to produce HTML. That's it!
