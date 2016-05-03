
import { ClassList } from './classlist';
import { Node } from './node';

// Source: https://www.w3.org/TR/html-markup/syntax.html#syntax-elements
var rVoidElements = /area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr/;

export function HTMLElement (options) {
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

var doNotRender = {
  tagName: true,
  view: true
}

HTMLElement.prototype.render = function () {
  var attributes = [];
  var hasChildren = false;
  var content = '';
  var isVoidEl = this.isVoidEl;

  for (var key in this) {
    if ('isVoidEl' === key || !this.hasOwnProperty(key)) {
      continue;
    }
    if (key === 'childNodes') {
      if (isVoidEl) {
        continue;
      }
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

  if (!isVoidEl && hasChildren) {
    return '<' + [this.tagName].concat(attributes).join(' ') + '>' + this.childNodes.map(childRenderer).join('') + '</' + this.tagName + '>'
  } else if (content) {
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
