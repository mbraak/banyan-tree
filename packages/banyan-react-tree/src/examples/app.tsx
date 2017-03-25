import React from "react";

import TreeComponent from "../tree_component";
import { Tree } from "../immutable_tree";
import { Node } from "../immutable_node";

const renderTitle = (node: Node) => (
    <span>
        {node.get("name")}
        <span className="rank">{node.get("rank")}</span>
    </span>
);

function App({ tree, dispatch }: {tree: Tree, dispatch: any}) {
    return <TreeComponent tree={tree} dispatch={dispatch} renderTitle={renderTitle} />;
}

export default App;
