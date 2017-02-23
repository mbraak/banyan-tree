import React from "react";
import { createStore } from "redux";
import { Provider, connect } from "react-redux";
import { mount } from "enzyme";
import { expect } from "chai";

import TreeComponent from "../tree_component";
import { Tree } from "../immutable_tree";
import reduceTree from "../reducer";

describe("TreeComponent", () => {
    it("renders", () => {
        const data = [ { id: 1, name: "node1" } ];
        const tree = new Tree(data);

        const store = createStore(reduceTree, tree);

        const wrapper = mount(<TreeComponent tree={tree} dispatch={store.dispatch} />);

        expect(wrapper.find(".banyan-title").text()).to.equal("node1");
    });
});
