import React from "react";
import { createStore, Store } from "redux";
import { expect } from "chai";
import { mount } from "enzyme";

import TreeComponent from "../tree_component";
import { Tree } from "../immutable_tree";
import reduceTree from "../reducer";
import { test_data, example_data } from "../testutil/example_data";
import { render, treeElementToString } from "../testutil/render";

describe("TreeComponent", () => {
    it("render", () => {
        const tree = new Tree(test_data).openAllFolders();
        const store = createStore(reduceTree, tree);

        const el = render(<TreeComponent tree={tree} dispatch={store.dispatch} />);
        expect(el.hasClass("banyan-tree")).to.eq(true);

        expect(treeElementToString(el)).to.equal("n1(n1a n1b) n2(n2a n2b)");
    });

    it("select", () => {
        // setup
        const store = initialStore();

        // find titles
        const wrapper1 = renderTree(store);

        expect(wrapper1.find(".banyan-title").length).to.eq(31);
        expect(wrapper1.find(".banyan-selected").length).to.eq(0);

        // click on node
        const div = wrapper1.findWhere(
            el => el.name() === "TreeNode" && el.prop("node").name === "Theropods"
        ).first().children("div").first();

        div.simulate("click");

        const selected_node = store.getState().getSelectedNode();
        expect(selected_node).to.not.be.null;

        if (selected_node) {
            expect(selected_node.name).to.eql("Theropods");
        }

        // check tree
        const wrapper2 = renderTree(store);
        expect(wrapper2.find(".banyan-selected").length).to.eq(1);
   });
});

const initialStore = () => (
    createStore(
        reduceTree,
        new Tree(example_data).openAllFolders()
    )
);

const renderTree = (store: Store<Tree>) => (
    mount(
        <TreeComponent tree={store.getState()} dispatch={store.dispatch} />
    )
);
