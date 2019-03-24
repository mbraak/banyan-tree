import React from "react";
import ReactDOM from "react-dom";
import { example_data } from "dinosaur-data";
import { Tree } from "@banyan/immutable-tree";

import App from "./app";

import "@banyan/react-tree/banyan-react-tree.css";
import "./example.css";

const tree = new Tree([example_data]).openLevel(1);

ReactDOM.render(<App tree={tree} />, document.getElementById("tree1"));
