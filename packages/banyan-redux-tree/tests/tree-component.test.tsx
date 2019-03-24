import React from "react";
import { mount, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { createStore, Store } from "redux";

import { Tree } from "@banyan/immutable-tree";

import { test_data, example_data } from "./testutil/example_data";
import { render, treeElementToString } from "./testutil/render";

import ReduxComponent from "../src/component";
import { reduceTree } from "../src/reducer";

configure({ adapter: new Adapter() });

test("render", () => {
    const tree = new Tree(test_data).openAllFolders();
    const store = createStore(reduceTree, tree);

    const el = render(<ReduxComponent tree={tree} dispatch={store.dispatch} />);
    expect(el.hasClass("banyan-tree")).toBe(true);

    expect(treeElementToString(el)).toBe("n1(n1a n1b) n2(n2a n2b)");
});

test("select", () => {
    // setup
    const store = initialStore();

    // find titles
    const wrapper1 = renderTree(store);

    expect(wrapper1.find(".banyan-title").length).toBe(31);
    expect(wrapper1.find(".banyan-selected").length).toBe(0);

    // click on node
    const div = wrapper1
        .findWhere(
            el =>
                el.name() === "TreeNode" &&
                el.prop("node").get("name") === "Theropods"
        )
        .first()
        .find("li div")
        .first();

    div.simulate("click");

    const selected_node = store.getState().getSelectedNode();
    expect(selected_node).not.toBe(null);

    if (selected_node) {
        expect(selected_node.get("name")).toBe("Theropods");
    }

    // check tree
    const wrapper2 = renderTree(store);
    expect(wrapper2.find(".banyan-selected").length).toBe(1);
});

const initialStore = () =>
    createStore(reduceTree, new Tree(example_data).openAllFolders());

const renderTree = (store: Store<Tree>) =>
    mount(<ReduxComponent tree={store.getState()} dispatch={store.dispatch} />);
