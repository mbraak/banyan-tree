import * as node from "../src/immutable_node";

const data1 = [
    {
        name: "n1",
        id: 1,
        children: [{ name: "n1a", id: 2 }, { name: "n1b", id: 3 }]
    },
    {
        name: "n2",
        id: 4,
        children: [{ name: "n2a", id: 5 }, { name: "n2b", id: 6 }]
    }
];

test("has children", () => {
    const t1 = node.create(data1);
    const n1 = node.doGetNodeByName(t1, "n1").node;
    const n1a = node.doGetNodeByName(t1, "n1a").node;

    expect(node.hasChildren(n1)).toBe(true);
    expect(node.hasChildren(n1a)).toBe(false);
});

test("create", () => {
    const t1 = node.create();

    expect(node.toString(t1)).toBe("");
});

test("create from data", () => {
    const t1 = node.create(data1);

    expect(node.toString(t1)).toBe("n1(n1a n1b) n2(n2a n2b)");
});

test("add node", () => {
    // t1: empty
    const t1 = node.create();

    // t2: add 'n1'
    const [t2, changedT2] = node.addNode(t1, { name: "n1", id: 1 });

    // t3: add 'n1/n1a'
    const n1 = node.getNodeByName(t2, "n1");
    const [t3, changedT3] = node.addNode(t2, n1, { name: "n1a", id: 2 });

    // t4: add 'n1/n1a/n1b'
    const n1a = node.doGetNodeByName(t3, "n1a");
    const [t4, changedT4] = node.addNode(t3, n1a, { name: "n1b", id: 3 });

    expect(node.toString(t2)).toBe("n1");
    expect(Object.keys(changedT2)).toEqual(["newChild", "changedNodes"]);
    expect(changedT2.changedNodes).toEqual([]);
    expect(node.toString(t3)).toBe("n1(n1a)");
    expect(t3.get("isRoot")).toBe(true);
    expect(node.nodeListToString(changedT3.changedNodes)).toEqual("n1");
    expect(changedT3.newChild.get("name")).toBe("n1a");
    expect(n1a.node.get("parentId")).toBe(1);
    expect(node.nodeListToString(changedT4.changedNodes)).toBe("n1a n1");
    expect(node.toString(t4)).toBe("n1(n1a(n1b))");
});

test("remove node", () => {
    // t1: example tree
    const t1 = node.create(data1);

    // t2: remove n1
    const n1 = node.doGetNodeByName(t1, "n1");
    const [t2, infoT2] = node.removeNode(n1);

    // t3: remove n2a
    const n2a = node.doGetNodeByName(t2, "n2a");
    const [t3, infoT3] = node.removeNode(n2a);

    expect(node.toString(t2)).toEqual("n2(n2a n2b)");
    expect(infoT2.changedNodes).toEqual([]);
    expect(node.nodeListToString(infoT2.removedNodes)).toBe("n1 n1a n1b");
    expect(node.toString(t3)).toBe("n2(n2b)");
    expect(node.nodeListToString(infoT3.changedNodes)).toBe("n2");
    expect(node.nodeListToString(infoT3.removedNodes)).toBe("n2a");
});

test("update node", () => {
    const t1 = node.create(data1);

    const [t2, updateInfo] = node.updateNode(
        node.doGetNodeByName(t1, "n2a"),
        { name: "N2A" } // todo: color: "green"
    );

    expect(node.doGetNodeByName(t1, "n2a").node.get("id")).toBe(5);
    expect(node.doGetNodeByName(t2, "N2A").node.get("id")).toBe(5);
    expect(node.nodeListToString(updateInfo.changedNodes)).toBe("N2A n2");
    expect(node.toString(t2)).toBe("n1(n1a n1b) n2(N2A n2b)");
});

test("get node by name", () => {
    const t1 = node.create(data1);
    const n1a = node.doGetNodeByName(t1, "n1a");

    expect(n1a.node.get("name")).toBe("n1a");
    expect(node.nodeListToString(n1a.parents)).toBe("n1 [root]");
});

test("has attributes", () => {
    const data = [{ name: "node1", id: 1, color: "green" }];

    const t1 = node.create(data);

    const n1 = node.getNodeByName(t1, "node1");

    if (n1) {
        expect(n1.node.get("color")).toBe("green");
    }
});
