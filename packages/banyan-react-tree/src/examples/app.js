import React from "react";

import Tree from "../tree";
import TreeController from "../tree_controller";


const tree_controller = new TreeController();

tree_controller.on("init", () => {
    console.log("init");
});

tree_controller.on("select", node => {
    console.log("select", node.name);
});

tree_controller.on("open", node => {
    console.log("open", node.name);
});

tree_controller.on("close", node => {
    console.log("close", node.name);
});


const App = ({ data }) =>
    <div>
        <Tree data={data} autoOpen={2} controller={tree_controller} dragAndDrop={true} />
    </div>;


App.propTypes = {
    data: React.PropTypes.arrayOf(React.PropTypes.any)
};

export default App;
