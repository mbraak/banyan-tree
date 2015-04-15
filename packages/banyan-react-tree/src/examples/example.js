import React from "react";
import Tree from "../tree.jsx";
import {example_data} from "../testutil/example_data";


var TreeComponent = React.createFactory(Tree);

React.render(
    TreeComponent(
        {
            data: example_data,
            autoOpen: 2
        }
    ),
    document.getElementById("tree1")
);
