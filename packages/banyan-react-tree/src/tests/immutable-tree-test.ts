import { expect } from "chai";

import { Tree } from "../immutable_tree";
import { test_data } from "../testutil/example_data";

describe("Tree", () => {
    it("create empty tree", () => {
        const t = new Tree();

        expect(t.toString()).to.equal("");
        expect(t.getChildren().count()).to.equal(0);
    });

    it("create tree from data", () => {
        const t = new Tree(test_data);

        expect(t.getChildren().count()).to.equal(2);
        expect(t.toString()).to.equal("n1(n1a n1b) n2(n2a n2b)");
    });

    it("add node", () => {
        const t1 = new Tree();
        const t2 = t1.addNode({ name: "n1", id: 1 });

        expect(t1.toString()).to.equal("");
        expect(t2.toString()).to.equal("n1");
    });

    it("get node by name", () => {
        const t = new Tree(test_data);
        const n2a = t.doGetNodeByName("n2a");

        expect(n2a.name).to.equal("n2a");
    });

    it("add child node", () => {
        const t1 = new Tree()
            .addNode({ name: "n1", id: 1 })
            .addNode({ name: "n2", id: 2 });

        const n1 = t1.doGetNodeByName("n1");
        const t2 = t1.addNode(n1, { name: "n1a", id: 3 });

        expect(t1.toString()).to.equal("n1 n2");
        expect(t2.toString()).to.equal("n1(n1a) n2");
    });

    it("remove node", () => {
        const t1 = new Tree()
            .addNode({ name: "n1", id: 1 })
            .addNode({ name: "n2", id: 2 });

        const n1 = t1.doGetNodeByName("n1");
        const t2 = t1.removeNode(n1);

        expect(t1.toString()).to.equal("n1 n2");
        expect(t2.toString()).to.equal("n2");
        expect(t2.getNodeById(1)).to.equal(undefined);
    });

    it("remove node with children", () => {
        const t1 = new Tree(test_data);

        const n2 = t1.doGetNodeByName("n2");
        const t2 = t1.removeNode(n2);

        expect(t2.toString()).to.equal("n1(n1a n1b)");
        expect(t2.getNodeById(4)).to.equal(undefined);
        expect(t2.getNodeById(5)).to.equal(undefined);
    });

    it("remove child node", () => {
        const t1 = new Tree(test_data);

        const n1a = t1.doGetNodeByName("n1a");
        const t2 = t1.removeNode(n1a);

        expect(t1.toString()).to.equal("n1(n1a n1b) n2(n2a n2b)");
        expect(t2.toString()).to.equal("n1(n1b) n2(n2a n2b)");
        expect(t2.getNodeById(2)).to.equal(undefined);
    });

    it("has children", () => {
        const t1 = new Tree(test_data);

        expect(t1.hasChildren()).to.equal(true);
    });

    it("is node open", () => {
        const t1 = new Tree(test_data);
        const t2 = t1.openNode(1);
        const t3 = t2.closeNode(1);
        const t4 = t3.toggleNode(1);

        expect(t1.isNodeOpen(1)).to.equal(false);
        expect(t2.isNodeOpen(1)).to.equal(true);
        expect(t3.isNodeOpen(1)).to.equal(false);
        expect(t4.isNodeOpen(1)).to.equal(true);
    });

    it("get node by id", () => {
        const t1 = new Tree(test_data);
        const t2 = t1.addNode({ name: "n3", id: 7 });

        const n2a = t1.doGetNodeByName("n2a");
        const t3 = t1.removeNode(n2a);

        expect(t1.doGetNodeById(2).name).to.equal("n1a");
        expect(t2.doGetNodeById(7).name).to.equal("n3");
        expect(t3.getNodeById(5)).to.equal(undefined);
    });

    it("select node", () => {
        const t1 = new Tree(test_data);
        const t2 = t1.selectNode(5);
        const t3 = t1.selectNode(6);

        expect(t1.doGetNodeById(5).is_selected).to.equal(false);
        expect(t2.doGetNodeById(5).is_selected).to.equal(true);
        expect(t3.doGetNodeById(5).is_selected).to.equal(false);
        expect(t3.doGetNodeById(6).is_selected).to.equal(true);
    });

    it("update node", () => {
        const t1 = new Tree(test_data);
        const t2 = t1.updateNode(
            t1.doGetNodeByName("n2a"),
            { name: "N2A" }
        );

        expect(t1.doGetNodeById(5).get("name")).to.equal("n2a");
        expect(t2.doGetNodeById(5).get("name")).to.equal("N2A");
        expect(t2.toString()).to.equal("n1(n1a n1b) n2(N2A n2b)");
    });
});
