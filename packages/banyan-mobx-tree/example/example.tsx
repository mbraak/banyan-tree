import * as React from "react";
import * as ReactDOM from "react-dom";
import { Tree } from "banyan-immutable-tree/lib/immutable_tree";
import { example_data } from "dinosaur-data";

import { App } from "./app";
import TreeStore from "../src/tree_store";

import "banyan-react-tree/banyan-react-tree.css";
import "./example.css";

const tree = new Tree([example_data]).openLevel(1);

const treeStore = new TreeStore(tree);

ReactDOM.render(
    <App treeStore={treeStore} />,
    document.getElementById("tree1")
);
