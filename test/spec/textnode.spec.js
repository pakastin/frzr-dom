
import test from "tape";
import { Node } from "../../src/node";
import { TextNode } from "../../src/textnode";

test("TextNode", t => {
    t.test("extends from Node", t => {
        t.equal((new TextNode()) instanceof Node, true);
        t.end();
    });

    t.test("renders textcontent", t => {
        t.equal((new TextNode("hello world")).render(), "hello world");
        t.end();
    });
});
