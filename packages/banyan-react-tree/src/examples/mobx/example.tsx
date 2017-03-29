import React from "react";
import ReactDOM from "react-dom";

import { App } from "./app";
import { Tree } from "../../immutable_tree";
import TreeStore from "../../mobx/tree_store";

import example_data from "../dinosaurs.json";

import "../../../css/banyan-react-tree.css";
import "../example.css";

const tree = new Tree([example_data])
    .openLevel(1);

const tree_store = new TreeStore(tree);

ReactDOM.render(
    <App tree_store={tree_store} />,
    document.getElementById("tree1")
);
