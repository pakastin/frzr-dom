import test from "tape";
import { HTMLElement } from "../src/htmlelement";
import { Node } from "../src/node";
import { ClassList } from "../src/classlist";

test("HTMLElement", t => {
    t.test("extends Node", t => {
        t.equal((new HTMLElement) instanceof Node, true, "extends Node");
        t.end();
    });

    t.test("has render method", t => {
        t.equal(typeof (new HTMLElement).render, "function");
        t.end();
    });

    t.test("has style property", t => {
        t.equal((new HTMLElement).hasOwnProperty("style"), true);
        t.end();
    });

    t.test("has childNodes property", t => {
        t.equal((new HTMLElement).hasOwnProperty("childNodes"), true);
        t.end();
    });

    t.test("sets properties from options object passed to constructor", t => {
        var options = {
            tagName: "div"
        };
        var el = new HTMLElement(options);

        t.equal(el.tagName, "div", "tagName property was set");
        t.end();
    });

    t.test("has classList instance", t => {
        var el = new HTMLElement();

        t.equal(el.classList instanceof ClassList, true, "classList is instance of ClassList");
        t.end();
    });

    t.test("implements setAttribute/getAttribute", t => {
        var el = new HTMLElement();

        t.equal(el.getAttribute("hello"), undefined);
        t.equal(el.setAttribute("hello", "world"));
        t.equal(el.getAttribute("hello"), "world");
        t.end();
    });

    t.test("renders into html string", t => {
        t.equal(new HTMLElement({ tagName: "div" }).render(), "<div></div>");
        t.end();
    });

    t.test("render includes styles", t => {
        var styles = {
            "font-weight": "bold",
            "background-color": "pink"
        };
        t.equal(new HTMLElement({ tagName: "div", style: styles }).render(), "<div style=\"font-weight:bold;background-color:pink;\"></div>");
        t.end();
    });

    t.test("renders arbitrary attibutes", t => {
        var el = new HTMLElement({ "data-x": "foo" });

        t.equal(el.render(), "<div data-x=\"foo\"></div>");
        t.end();
    });

    t.test("innerHTML", t => {
        var el = new HTMLElement({ innerHTML: "<b>Hello world!</b>" });
        t.equal(el.render(), "<div><b>Hello world!</b></div>");
        t.end();
    });

    t.test("textContent", t => {
        var el = new HTMLElement({ textContent: "Hello world!" });
        t.equal(el.render(), "<div>Hello world!</div>");
        t.end();
    });

    t.test("renders void elements as void elements", t => {
        t.equal(new HTMLElement({ tagName: "br" }).render(), "<br/>");
        t.end();
    });

    t.test("childNodes for void elements are silently dropped", t => {
        var el = new HTMLElement({ tagName: "br" });
        el.appendChild(new HTMLElement());
        t.equal(el.firstChild, undefined);
        t.end();
    });

    t.test("has appendChild method", t => {
        t.equal(typeof (new HTMLElement()).appendChild, "function");
        t.end();
    });

    t.test("appendChild appends childNode", t => {
        var el = new HTMLElement();
        var child = new HTMLElement();
        el.appendChild(child);

        t.equal(el.firstChild, child);
        t.end();
    });

    t.test("renders child nodes", t => {
        var el = new HTMLElement();
        el.appendChild(new HTMLElement({ className: "child" }));

        t.equal(el.render(), "<div><div class=\"child\"></div></div>");
        t.end();
    });

    t.test("has removeChild method", t => {
        t.equal(typeof (new HTMLElement()).removeChild, "function");
        t.end();
    });

    t.test("removeChild removes child", t => {
        var el = new HTMLElement();
        var child = new HTMLElement();
        el.appendChild(child);
        el.removeChild(child);

        t.equal(el.firstChild, undefined);
        t.end();
    });

    t.test("has insertBefore method", t => {
        t.equal(typeof (new HTMLElement()).insertBefore, "function");
        t.end();
    });

    t.test("insert before inserts in correct slot", t => {
        var el = new HTMLElement();
        var child1 = new HTMLElement();
        var child2 = new HTMLElement();

        el.appendChild(child1);
        el.insertBefore(child2, child1);

        t.equal(el.firstChild, child2);
        t.end();
    });
});
