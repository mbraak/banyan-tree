import React from "react";
import { createStore } from "redux";
import { Provider, connect } from "react-redux";
import { expect } from "chai";
import cheerio from "cheerio";

import TreeComponent from "../tree_component";
import { Tree } from "../immutable_tree";
import reduceTree from "../reducer";
import { test_data } from "../testutil/example_data";
import { render, treeElementToString } from "../testutil/render";

describe("TreeComponent", () => {
    it("render", () => {
        const tree = new Tree(test_data).openAllFolders();

        const store = createStore(reduceTree, tree);

        const el = render(<TreeComponent tree={tree} dispatch={store.dispatch} />);
        expect(el.hasClass("banyan-tree")).to.eq(true);

        expect(treeElementToString(el)).to.equal("n1(n1a n1b) n2(n2a n2b)");
    });
});
