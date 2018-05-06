import * as React from "react";
import { mount, configure } from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";

import { Tree } from "banyan-immutable-tree/lib/immutable_tree";

import { test_data, example_data } from "./testutil/example_data";
import { render, treeElementToString } from "./testutil/render";

import { TreeComponent } from "../src/tree_component";

configure({ adapter: new Adapter() });

test("render", () => {
    const tree = new Tree(test_data).openAllFolders();

    const el = render(<TreeComponent tree={tree} />);
    expect(el.hasClass("banyan-tree")).toBe(true);

    expect(treeElementToString(el)).toBe("n1(n1a n1b) n2(n2a n2b)");
});

test("select", () => {
    // setup
    const originalTree = new Tree(example_data).openAllFolders();

    // find titles
    const wrapper1 = mount(<TreeComponent tree={originalTree} />);

    const currentTree = () => wrapper1.state("tree") as Tree;

    expect(wrapper1.find(".banyan-title").length).toBe(31);
    expect(wrapper1.find(".banyan-selected").length).toBe(0);

    expect(currentTree().getSelectedNode()).toBe(null);

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

    const selectedNode = currentTree().getSelectedNode();
    expect(selectedNode).not.toBe(null);

    if (selectedNode) {
        expect(selectedNode.get("name")).toBe("Theropods");
        expect(selectedNode.get("is_selected")).toBe(true);
    }

    // check original tree
    expect(originalTree.getSelectedNode()).toBeNull();
    expect(
        originalTree.getNodeByName("Theropods")!.get("is_selected")
    ).toBeFalsy();

    // create new component from tree
    const wrapper2 = mount(<TreeComponent tree={currentTree()} />);
    expect(wrapper2.find(".banyan-selected").length).toBe(1);
});
