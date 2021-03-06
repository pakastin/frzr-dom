'use strict';

function ClassList (el) {
  var this$1 = this;

  var classNames = (this.className && this.className.split(' ')) || [];

  this.length = classNames.length;

  for (var i = 0; i < classNames.length; i++) {
    this$1[i] = classNames[i];
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
  var this$1 = this;

  for (var i = 0; i < this$1.length; i++) {
    if (this$1[i] === className) {
      return true;
    }
  }
  return false;
}

ClassList.prototype.remove = function (className) {
  var this$1 = this;

  for (var i = 0; i < this$1.length; i++) {
    if (classNames[i] === className) {
      this$1.splice(i, 1);
      this$1._updateClassName();
    }
  }
}

function Node () {}

// Source: https://www.w3.org/TR/html-markup/syntax.html#syntax-elements
var voidElementLookup = 'area base br col command embed hr img input keygen link meta param source track wbr'.split(' ').reduce(function (lookup, tagName) {
  lookup[tagName] = true;
  return lookup;
}, {});

function HTMLElement (options) {
  this.childNodes = [];
  this.style = {};

  for (var key in options) {
    this[key] = options[key];
  }

  if (!this.tagName) {
    this.tagName = 'div';
  }

  this.tagName = this.tagName.toLowerCase();

  this.isVoidEl = voidElementLookup[this.tagName];
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
  var isVoidEl = this.isVoidEl;
  var attributes = [];

  var hasChildren = false;
  var content = '';

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
      if (typeof this[key] === 'function') {
        continue;
      }
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
  var this$1 = this;

  if (this.isVoidEl) {
    return; // Silently ignored
  }
  child.parentNode = this;
  for (var i = 0; i < this$1.childNodes.length; i++) {
    if (this$1.childNodes[i] === child) {
      this$1.childNodes.splice(i, 1);
    }
  }
  this.childNodes.push(child);
}

HTMLElement.prototype.insertBefore = function (child, before) {
  var this$1 = this;

  if (this.isVoidEl) {
    return; // Silently ignored
  }
  child.parentNode = this;
  for (var i = 0; i < this$1.childNodes.length; i++) {
    if (this$1.childNodes[i] === before) {
      this$1.childNodes.splice(i++, 0, child);
    } else if (this$1.childNodes[i] === child) {
      this$1.childNodes.splice(i, 1);
    }
  }
}

HTMLElement.prototype.replaceChild = function (child, replace) {
  var this$1 = this;

  if (this.isVoidEl) {
    return; // Silently ignored
  }
  child.parentNode = this;
  for (var i = 0; i < this$1.childNodes.length; i++) {
    if (this$1.childNodes[i] === replace) {
      this$1.childNodes[i] = child;
    }
  }
}

HTMLElement.prototype.removeChild = function (child) {
  var this$1 = this;

  if (this.isVoidEl) {
    return; // Silently ignored
  }
  child.parentNode = null;
  for (var i = 0; i < this$1.childNodes.length; i++) {
    if (this$1.childNodes[i] === child) {
      this$1.childNodes.splice(i, 1);
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
      var this$1 = this;

      var siblings = this.parentNode.childNodes;

      for (var i = 0; i < siblings.length; i++) {
        if (siblings[i] === this$1) {
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

function Document () {
  this.head = this.createElement('head');
  this.body = this.createElement('body');
}

Document.prototype.createElement = function (tagName) {
  return new HTMLElement({
    tagName: tagName
  });
}

Document.prototype.createElementNS = function (ns, tagName) {
  return new HTMLElement({
    tagName: tagName
  });
}

Document.prototype.createTextNode = function (text) {
  return new TextNode(text);
}

global.document = new Document();

global.HTMLElement = HTMLElement;
global.Node = Node;
global.navigator = {
  userAgent: ''
}

function render (view, inner) {
  var el = view.el || view;

  return el.render(inner);
}

exports.Document = Document;
exports.render = render;