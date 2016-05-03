import test from "tape";
import { Node } from "../src/node";

test("Node", t => {
    t.equal((new Node()) instanceof Node, true);
    t.end();
});
