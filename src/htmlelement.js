
import { ClassList } from './classlist';
import { Node } from './node';

// Source: https://www.w3.org/TR/html-markup/syntax.html#syntax-elements
const voidElementLookup = 'area base br col command embed hr img input keygen link meta param source track wbr'.split(' ').reduce(function (lookup, tagName) {
  lookup[tagName] = true;
  return lookup;
}, {});

export function HTMLElement (options) {
  this.childNodes = [];
  this.style = {};

  for (const key in options) {
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

const shouldNotRender = {
  tagName: true,
  view: true,
  isVoidEl: true,
  parent: true,
  parentNode: true,
  childNodes: true
}

HTMLElement.prototype.render = function (inner) {
  const isVoidEl = this.isVoidEl;
  const attributes = [];

  let hasChildren = false;
  let content = '';

  for (const key in this) {
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
      let styles = '';

      for (const styleName in this.style) {
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
  if (this.isVoidEl) {
    return; // Silently ignored
  }
  child.parentNode = this;
  for (let i = 0; i < this.childNodes.length; i++) {
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
  for (let i = 0; i < this.childNodes.length; i++) {
    if (this.childNodes[i] === before) {
      this.childNodes.splice(i++, 0, child);
    } else if (this.childNodes[i] === child) {
      this.childNodes.splice(i, 1);
    }
  }
}

HTMLElement.prototype.replaceChild = function (child, replace) {
  if (this.isVoidEl) {
    return; // Silently ignored
  }
  child.parentNode = this;
  for (let i = 0; i < this.childNodes.length; i++) {
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
  for (let i = 0; i < this.childNodes.length; i++) {
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
      const siblings = this.parentNode.childNodes;

      for (let i = 0; i < siblings.length; i++) {
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
