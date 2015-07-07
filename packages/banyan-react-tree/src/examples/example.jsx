/* @flow */
import React from "react";
import {render} from "react-dom";

import Tree from "../tree.jsx";

import {example_data} from "../testutil/example_data";


render(
    <Tree data={example_data} autoOpen={2}></Tree>,
    document.getElementById("tree1")
);
