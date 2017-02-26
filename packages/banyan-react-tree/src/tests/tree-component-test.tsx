import React from "react";
import { createStore } from "redux";
import { Provider, connect } from "react-redux";
import { expect } from "chai";
import cheerio from "cheerio";
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
        const tree = new Tree(example_data).openAllFolders();
        const store = createStore(reduceTree, tree);
        const tree_component = <TreeComponent tree={tree} dispatch={store.dispatch} />;
        const wrapper = mount(tree_component);

        // find titles
        expect(wrapper.find(".banyan-title").length).to.eq(31);
        expect(wrapper.find(".banyan-selected").length).to.eq(0);

        // click
        const div = wrapper.findWhere(
            el => el.name() === "TreeNode" && el.prop("node").name === "Theropods"
        ).first().children("div").first();

        div.simulate("click");

        // check tree
        const updated_component = <TreeComponent tree={store.getState()} dispatch={store.dispatch} />;
        const updated_wrapper = mount(updated_component);
        expect(updated_wrapper.find(".banyan-selected").length).to.eq(1);
   });
});
