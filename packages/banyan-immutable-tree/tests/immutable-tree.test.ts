import { Tree } from "../src/immutable_tree";
import { test_data, example_data } from "./testutil/example_data";

test("create empty tree", () => {
    const t = new Tree();

    expect(t.toString()).toBe("");
    expect(t.getChildren().count()).toBe(0);
});

test("create tree from data", () => {
    const t = new Tree(test_data);

    expect(t.getChildren().count()).toBe(2);
    expect(t.toString()).toBe("n1(n1a n1b) n2(n2a n2b)");
});

test("add node", () => {
    const t1 = new Tree();
    const t2 = t1.addNode({ name: "n1", id: 1 });

    expect(t1.toString()).toBe("");
    expect(t2.toString()).toBe("n1");
});

test("get node by name", () => {
    const t = new Tree(test_data);
    const n2a = t.doGetNodeByName("n2a");

    expect(n2a.get("name")).toBe("n2a");
});

test("add child node", () => {
    const t1 = new Tree()
        .addNode({ name: "n1", id: 1 })
        .addNode({ name: "n2", id: 2 });

    const n1 = t1.doGetNodeByName("n1");
    const t2 = t1.addNode({ name: "n1a", id: 3 }, n1);

    expect(t1.toString()).toBe("n1 n2");
    expect(t2.toString()).toBe("n1(n1a) n2");
});

test("remove node", () => {
    const t1 = new Tree()
        .addNode({ name: "n1", id: 1 })
        .addNode({ name: "n2", id: 2 });

    const n1 = t1.doGetNodeByName("n1");
    const t2 = t1.removeNode(n1);

    expect(t1.toString()).toBe("n1 n2");
    expect(t2.toString()).toBe("n2");
    expect(t2.getNodeById(1)).toBe(undefined);
});

test("remove node with children", () => {
    const t1 = new Tree(test_data);

    const n2 = t1.doGetNodeByName("n2");
    const t2 = t1.removeNode(n2);

    expect(t2.toString()).toBe("n1(n1a n1b)");
    expect(t2.getNodeById(4)).toBe(undefined);
    expect(t2.getNodeById(5)).toBe(undefined);
});

test("remove child node", () => {
    const t1 = new Tree(test_data);

    const n1a = t1.doGetNodeByName("n1a");
    const t2 = t1.removeNode(n1a);

    expect(t1.toString()).toBe("n1(n1a n1b) n2(n2a n2b)");
    expect(t2.toString()).toBe("n1(n1b) n2(n2a n2b)");
    expect(t2.getNodeById(2)).toBe(undefined);
});

test("has children", () => {
    const t1 = new Tree(test_data);

    expect(t1.hasChildren()).toBe(true);
});

test("is node open", () => {
    const t1 = new Tree(test_data);
    const t2 = t1.openNode(1);
    const t3 = t2.closeNode(1);
    const t4 = t3.toggleNode(1);

    expect(t1.isNodeOpen(1)).toBe(false);
    expect(t2.isNodeOpen(1)).toBe(true);
    expect(t3.isNodeOpen(1)).toBe(false);
    expect(t4.isNodeOpen(1)).toBe(true);
});

test("get node by id", () => {
    const t1 = new Tree(test_data);
    const t2 = t1.addNode({ name: "n3", id: 7 });

    const n2a = t1.doGetNodeByName("n2a");
    const t3 = t1.removeNode(n2a);

    expect(t1.doGetNodeById(2).get("name")).toBe("n1a");
    expect(t2.doGetNodeById(7).get("name")).toBe("n3");
    expect(t3.getNodeById(5)).toBe(undefined);
});

test("select node", () => {
    const t1 = new Tree(test_data);
    const t2 = t1.selectNode(5);
    const t3 = t1.selectNode(6);

    expect(t1.doGetNodeById(5).get("is_selected")).toBeFalsy();
    expect(t2.doGetNodeById(5).get("is_selected")).toBe(true);
    expect(t3.doGetNodeById(5).get("is_selected")).toBeFalsy();
    expect(t3.doGetNodeById(6).get("is_selected")).toBe(true);
});

test("update node", () => {
    const t1 = new Tree(test_data);
    const t2 = t1.updateNode(t1.doGetNodeByName("n2a"), { name: "N2A" });

    expect(t1.doGetNodeById(5).get("name")).toBe("n2a");
    expect(t2.doGetNodeById(5).get("name")).toBe("N2A");
    expect(t2.toString()).toBe("n1(n1a n1b) n2(N2A n2b)");
});

test("get next node", () => {
    const assertNextNode = (
        tree: Tree,
        node_name: string,
        next_name: string | null
    ) => {
        const next_node = tree.getNextNode(tree.doGetNodeByName(node_name));

        if (!next_name) {
            expect(next_node).toBe(null);
        } else {
            expect(next_node).not.toBe(null);

            if (next_node) {
                expect(next_node.get("name")).toBe(next_name);
            }
        }
    };

    // tree1; example data
    const tree1 = new Tree(test_data);
    assertNextNode(tree1, "n1", "n2");
    assertNextNode(tree1, "n2", null);

    // open all nodes
    const tree2 = tree1.openAllFolders();
    assertNextNode(tree2, "n1", "n1a");
    assertNextNode(tree2, "n1a", "n1b");
    assertNextNode(tree2, "n1b", "n2");
});

test("get previous node", () => {
    const assertPreviousNode = (
        tree: Tree,
        node_name: string,
        previous_name: string | null
    ) => {
        const previous_node = tree.getPreviousNode(
            tree.doGetNodeByName(node_name)
        );

        if (!previous_name) {
            expect(previous_node).toBe(null);
        } else {
            expect(previous_node).not.toBe(null);

            if (previous_node) {
                expect(previous_node.get("name")).toBe(previous_name);
            }
        }
    };

    // tree1; example data
    const tree1 = new Tree(example_data).openAllFolders();
    assertPreviousNode(tree1, "Saurischia", null);
    assertPreviousNode(tree1, "Herrerasaurians", "Saurischia");
    assertPreviousNode(tree1, "Sauropodomorphs", "Avialans");
});
