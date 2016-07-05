
import { HTMLElement } from './htmlelement';
import { Node } from './node';
import { TextNode } from './textnode';

export function Document () {
  this.head = new HTMLElement();
  this.body = new HTMLElement();
}

global.document = new Document();

global.HTMLElement = HTMLElement;
global.Node = Node;
global.navigator = {
  userAgent: ''
}

export function render (view, inner) {
  const el = view.el || view;

  return el.render(inner);
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
