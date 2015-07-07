import React from "react";

import Tree from "../tree.jsx";
import TreeController from "../tree_controller";


var tree_controller = new TreeController();
tree_controller.on("init", function() {
    console.log("init");
});

tree_controller.on("select", function(node) {
    console.log("select", node.name);
});

tree_controller.on("open", function(node) {
    console.log("open", node.name);
});

tree_controller.on("close", function(node) {
    console.log("close", node.name);
});

export default class App extends React.Component {
    render() {
        return (
            <div>
                <Tree url="/examples/data/" autoOpen={2} controller={tree_controller}></Tree>
            </div>
        );
    }

    onClickReload(e) {
        //var node = tree_controller.getNodeByName('Theropods');

        //tree_controller.openNode(node);
    }
}
