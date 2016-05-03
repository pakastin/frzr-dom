
import { HTMLElement } from './htmlelement';
import { Node } from './node';
import { TextNode } from './textnode';

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

export function render (view) {
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
