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

function HTMLElement (options) {
  this.childNodes = [];
  this.style = {};

  for (var key in options) {
    this[key] = options[key];
  }
}

HTMLElement.prototype = Object.create(Node.prototype);
HTMLElement.prototype.constructor = HTMLElement;

HTMLElement.prototype.render = function () {
  var attributes = [];
  var hasChildren = false;
  var content = '';

  for (var key in this) {
    if (!this.hasOwnProperty(key)) {
      continue;
    }
    if (key === 'childNodes') {
      if (this.childNodes.length) {
        hasChildren = true;
      }
    } else if (key === 'innerHTML') {
      content = this.innerHTML;
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
    } else if (key !== 'view' && key !== 'tagName' && key !== 'parentNode') {
      attributes.push(key + '="' + this[key] + '"');
    }
  }

  if (hasChildren) {
    if (attributes.length) {
      return '<' + this.tagName + ' ' + attributes.join('') + '>' + this.childNodes.map(childRenderer).join('') + '</' + this.tagName + '>'
    } else {
      return '<' + this.tagName + '>' + this.childNodes.map(childRenderer).join('') + '</' + this.tagName + '>'
    }
  } else if (content) {
    return '<' + this.tagName + '>' + content + '</' + this.tagName + '>';
  } else {
    return '<' + this.tagName + '>';
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
  child.parentNode = this;
  for (var i = 0; i < this.childNodes.length; i++) {
    if (this.childNodes[i] === child) {
      this.childNodes.splice(i, 1);
    }
  }
  this.childNodes.push(child);
}

HTMLElement.prototype.insertBefore = function (child, before) {
  child.parentNode = this;
  for (var i = 0; i < this.childNodes.length; i++) {
    if (this.childNodes[i] === before) {
      this.childNodes.splice(i++, 0, child);
    } else if (this.childNodes[i] === child) {
      this.childNodes.splice(i, 1);
    }
  }
}

HTMLElement.prototype.removeChild = function (child) {
  child.parentNode = null;
  for (var i = 0; i < this.childNodes.length; i++) {
    if (this.childNodes[i] === child) {
      this.childNodes.splice(i, 1);
    }
  }
}

Object.defineProperties(HTMLElement.prototype, {
  classList: {
    get: function () {
      return new ClassList(this);
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
  var el = view.el || el;

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