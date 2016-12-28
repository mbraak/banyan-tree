/* eslint-env mocha */
import "babel-polyfill";
import { expect } from "chai";

import * as node from "../immutable_node";


const data1 = [
    {
        name: "n1",
        id: 1,
        children: [
            { name: "n1a", id: 2 },
            { name: "n1b", id: 3 }
        ]
    },
    {
        name: "n2",
        id: 4,
        children: [
            { name: "n2a", id: 5 },
            { name: "n2b", id: 6 }
        ]
    }
];

describe("Node", () => {
    it("has children", () => {
        const t1 = node.create(data1);
        const n1 = node.getNodeByName(t1, "n1").node;
        const n1a = node.getNodeByName(t1, "n1a").node;

        expect(node.hasChildren(n1)).to.equal(true);
        expect(node.hasChildren(n1a)).to.equal(false);
    });

    it("create", () => {
        const t1 = node.create();

        expect(node.toString(t1)).to.equal("");
    });

    it("create from data", () => {
        const t1 = node.create(data1);

        expect(node.toString(t1)).to.equal("n1(n1a n1b) n2(n2a n2b)");
    });

    it("add node", () => {
        // t1: empty
        const t1 = node.create();

        // t2: add 'n1'
        const [t2, changed_t2] = node.addNode(t1, { name: "n1", id: 1 });

        // t3: add 'n1/n1a'
        const n1 = node.getNodeByName(t2, "n1");
        const [t3, changed_t3] = node.addNode(t2, n1, { name: "n1a", id: 2 });

        // t4: add 'n1/n1a/n1b'
        const n1a = node.getNodeByName(t3, "n1a");
        const [t4, changed_t4] = node.addNode(t3, n1a, { name: "n1b", id: 3 });

        expect(node.toString(t2)).to.equal("n1");
        expect(Object.keys(changed_t2)).to.deep.equal(["new_child", "changed_nodes"]);
        expect(changed_t2.changed_nodes).to.deep.equal([]);
        expect(node.toString(t3)).to.equal("n1(n1a)");
        expect(t3.is_root).to.equal(true);
        expect(node.nodeListToString(changed_t3.changed_nodes)).to.equal("n1");
        expect(changed_t3.new_child.toObject()).to.deep.equal({
            id: 2, name: "n1a", parent_id: 1, is_root: false, children: undefined
        });
        expect(n1a.node.parent_id).to.equal(1);
        expect(node.nodeListToString(changed_t4.changed_nodes)).to.equal("n1a n1");
        expect(node.toString(t4)).to.equal("n1(n1a(n1b))");
    });

    it("remove node", () => {
        // t1: example tree
        const t1 = node.create(data1);

        // t2: remove n1
        const n1 = node.getNodeByName(t1, "n1");
        const [t2, info_t2] = node.removeNode(n1);

        // t3: remove n2a
        const n2a = node.getNodeByName(t2, "n2a");
        const [t3, info_t3] = node.removeNode(n2a);

        expect(node.toString(t2)).to.equal("n2(n2a n2b)");
        expect(info_t2.changed_nodes).to.deep.equal([]);
        expect(node.nodeListToString(info_t2.removed_nodes)).to.equal("n1 n1a n1b");
        expect(node.toString(t3)).to.equal("n2(n2b)");
        expect(node.nodeListToString(info_t3.changed_nodes)).to.equal("n2");
        expect(node.nodeListToString(info_t3.removed_nodes)).to.equal("n2a");
    });

    it("update node", () => {
        const t1 = node.create(data1);

        const [t2, update_info] = node.updateNode(
            node.getNodeByName(t1, "n2a"),
            { name: "N2A" }  // todo: color: "green"
        );

        expect(node.getNodeByName(t1, "n2a").node.id).to.equal(5);
        expect(node.getNodeByName(t2, "N2A").node.id).to.equal(5);
        expect(node.nodeListToString(update_info.changed_nodes)).to.equal("N2A n2");
        expect(node.toString(t2)).to.equal("n1(n1a n1b) n2(N2A n2b)");
    });

    it("get node by name", () => {
        const t1 = node.create(data1);
        const n1a = node.getNodeByName(t1, "n1a");

        expect(n1a.node.name).to.equal("n1a");
        expect(node.nodeListToString(n1a.parents)).to.equal("n1 [root]");
    });
});
