/* @flow */
var React = require("react");  // change import for flow
var Tree = require("../tree.jsx"); // same

import {example_data} from "../testutil/example_data";


React.render(
    <Tree data={example_data} autoOpen={2}></Tree>,
    document.getElementById("tree1")
);
