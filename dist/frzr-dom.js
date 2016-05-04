'use strict';

function ClassList (el) {
  var classNames = (this.className && this.className.split(' ')) || [];

  for (var i = 0; i < classNames.length; i++) {
    this.push(classNames[i]);
  }
  this._updateClassName = function () {
    el.className = this.join(' ');
  }
}

ClassList.prototype = [];

ClassList.prototype.add = function (className) {
  if (!this.contains(className)) {
    this.push(className);
    this._updateClassName();
  }
}

ClassList.prototype.contains = function (className) {
  var found = false;

  for (var i = 0; i < this.length; i++) {
    if (this[i] === className) {
      found = true;
      break;
    }
  }
}

ClassList.prototype.remove = function (className) {
  for (var i = 0; i < this.length; i++) {
    if (classNames[i] === className) {
      this.splice(i, 1);
      this._updateClassName();
    }
  }
}

function Node () {}

// Source: https://www.w3.org/TR/html-markup/syntax.html#syntax-elements
var rVoidElements = /area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr/;

function HTMLElement (options) {
  this.childNodes = [];
  this.style = {};

  for (var key in options) {
    this[key] = options[key];
  }

  if (!this.tagName) {
    this.tagName = 'div';
  }

  this.isVoidEl = rVoidElements.test(this.tagName.toLowerCase());
}

HTMLElement.prototype = Object.create(Node.prototype);
HTMLElement.prototype.constructor = HTMLElement;

var shouldNotRender = {
  tagName: true,
  view: true,
  isVoidEl: true,
  parent: true,
  parentNode: true,
  childNodes: true
}

HTMLElement.prototype.render = function (inner) {
  var attributes = [];
  var hasChildren = false;
  var content = '';
  var isVoidEl = this.isVoidEl;

  for (var key in this) {
    if ('isVoidEl' === key || !this.hasOwnProperty(key)) {
      continue;
    }
    if (!isVoidEl && key === 'childNodes') {
      if (this.childNodes.length) {
        hasChildren = true;
      }
    } else if (key === 'className') {
      attributes.push('class="' + this[key] + '"');
    } else if (key === '_innerHTML') {
      content = this._innerHTML;
    } else if (key === 'style') {
      var styles = '';
      for (var styleName in this.style) {
        styles += styleName + ':' + this.style[styleName] + ';';
      }
      if (styles && styles.length) {
        attributes.push('style="' + styles + '"');
      }
    } else if (key === 'textContent') {
      content = this.textContent;
    } else if (!shouldNotRender[key]) {
      attributes.push(key + '="' + this[key] + '"');
    }
  }

  if (inner) {
    if (!isVoidEl && hasChildren) {
      return this.childNodes.map(childRenderer).join('');
    } else if (!isVoidEl && content){
      return content;
    } else {
      return '';
    }
  }

  if (!isVoidEl && hasChildren) {
    return '<' + [this.tagName].concat(attributes).join(' ') + '>' + this.childNodes.map(childRenderer).join('') + '</' + this.tagName + '>'
  } else if (!isVoidEl && content) {
    return '<' + [this.tagName].concat(attributes).join(' ') + '>' + content + '</' + this.tagName + '>';
  } else {
    return '<' + [this.tagName].concat(attributes).join(' ') + (isVoidEl ? '/>' : '></' + this.tagName + '>');
  }
}

HTMLElement.prototype.addEventListener = function () {}
HTMLElement.prototype.removeEventListener = function () {}

HTMLElement.prototype.setAttribute = function (attr, value) {
  this[attr] = value;
}

HTMLElement.prototype.getAttribute = function (attr) {
  return this[attr];
}

HTMLElement.prototype.appendChild = function (child) {
  if (this.isVoidEl) {
    return; // Silently ignored
  }
  child.parentNode = this;
  for (var i = 0; i < this.childNodes.length; i++) {
    if (this.childNodes[i] === child) {
      this.childNodes.splice(i, 1);
    }
  }
  this.childNodes.push(child);
}

HTMLElement.prototype.insertBefore = function (child, before) {
  if (this.isVoidEl) {
    return; // Silently ignored
  }
  child.parentNode = this;
  for (var i = 0; i < this.childNodes.length; i++) {
    if (this.childNodes[i] === before) {
      this.childNodes.splice(i++, 0, child);
    } else if (this.childNodes[i] === child) {
      this.childNodes.splice(i, 1);
    }
  }
}

HTMLElement.prototype.replaceChild = function (child, replace) {
  if (this.isVoidEl) {
    return;
  }
  child.parentNode = this;
  for (var i = 0; i < this.childNodes.length; i++) {
    if (this.childNodes[i] === replace) {
      this.childNodes[i] = child;
    }
  }
}

HTMLElement.prototype.removeChild = function (child) {
  if (this.isVoidEl) {
    return; // Silently ignored
  }
  child.parentNode = null;
  for (var i = 0; i < this.childNodes.length; i++) {
    if (this.childNodes[i] === child) {
      this.childNodes.splice(i, 1);
    }
  }
}

Object.defineProperties(HTMLElement.prototype, {
  _classList: {
    value: null,
    enumerable: false,
    configurable: false,
    writable: true
  },
  classList: {
    get: function () {
      if (!this._classList) {
        this._classList = new ClassList(this);
      }
      return this._classList;
    }
  },
  innerHTML: {
    get: function () {
      return this._innerHTML || this.render(true);
    },
    set: function (value) {
      return this._innerHTML = value;
    }
  },
  outerHTML: {
    get: function () {
      return this.render();
    }
  },
  firstChild: {
    get: function () {
      return this.childNodes[0];
    }
  },
  nextSibling: {
    get: function () {
      var siblings = this.parentNode.childNodes;

      for (var i = 0; i < siblings.length; i++) {
        if (siblings[i] === this) {
          return siblings[i + 1];
        }
      }
    }
  }
});

function childRenderer (child) {
  return child.render();
}

function TextNode (text) {
  this.textContent = text;
}

TextNode.prototype = Object.create(Node.prototype);
TextNode.prototype.constructor = TextNode;

TextNode.prototype.render = function () {
  return this.textContent;
}

global.document = {
  createElement: createElement,
  createTextNode: createTextNode,
  createElementNS: createElementNS,
  body: new HTMLElement({
    tagName: 'body'
  })
};

global.window = {};
global.HTMLElement = HTMLElement;
global.Node = Node;
global.navigator = {
  userAgent: ''
}

function render (view) {
  var el = view.el || view;

  return el.render();
}

function createElement (tagName) {
  return new HTMLElement({
    tagName: tagName
  });
}

function createElementNS (ns, tagName) {
  return new HTMLElement({
    tagName: tagName
  });
}

function createTextNode (text) {
  return new TextNode(text);
}

exports.render = render;