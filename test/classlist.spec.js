import test from "tape";
import { ClassList } from "../src/classlist";

test("ClassList", t => {
    t.test("initialised with empty array when className property is missing/empty", t => {
        var el = { };
        var cl = new ClassList(el);

        t.equal(cl.length, 0, "empty classList");
        t.end();
    });

    t.test("initialised with classNames string split by space", t => {
        var el = { className: "beep boop" };
        var cl = new ClassList(el);

        t.equal(cl.length, 2, "two classNames");
        t.end();
    });

    t.test("contains returns boolean false when nothing matches", t => {
        var el = { className: "beep" };
        var cl = new ClassList(el);

        t.equal(cl.contains("beep"), true, "contains beep");
        t.equal(cl.contains("boop"), false, "contains boop");
        t.end();
    });

    t.test("adding className updates className property on el", t => {
        var el = { className: "beep boop" };
        var cl = new ClassList(el);

        cl.add("zoop");

        t.equal(cl.length, 3, "three classNames");
        t.equal(cl.contains("zoop"), true, "contains zoop");
        t.equal(el.className, "beep boop zoop", "el.className is updated");
        t.end();
    });

    t.test("removing className updates className property on el", t => {
        var el = { className: "beep boop zoop" };
        var cl = new ClassList(el);

        cl.remove("zoop");

        t.equal(cl.length, 2, "two classNames");
        t.equal(cl.contains("zoop"), false, "zoop is removed");
        t.equal(el.className, "beep boop", "el.className is updated");
        t.end();
    });
});
