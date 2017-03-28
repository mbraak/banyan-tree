import React from "react";
import ReactDOM from "react-dom";

import App from "./app";
import { Tree } from "../immutable_tree";
import example_data from "./dinosaurs.json";

import "../../css/banyan-react-tree.css";
import "./example.css";

const tree = new Tree([example_data])
    .openLevel(1);

ReactDOM.render(
    <App tree={tree} />,
    document.getElementById("tree1")
);
