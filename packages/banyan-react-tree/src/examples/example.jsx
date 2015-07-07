/* @flow */
var React = require("react");  // change import for flow
var render = require("react-dom").render;
var Tree = require("../tree.jsx"); // same

import {example_data} from "../testutil/example_data";


render(
    <Tree data={example_data} autoOpen={2}></Tree>,
    document.getElementById("tree1")
);
