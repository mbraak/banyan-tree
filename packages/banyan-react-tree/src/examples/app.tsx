import React from "react";

import ReduxComponent from "../redux/component";
import { Tree } from "../immutable_tree";
import { Node } from "../immutable_node";

const renderTitle = (node: Node) => (
    <span>
        {node.get("name")}
        <span className="rank">{node.get("rank")}</span>
        { node.get("species_count")
            ? <span className="species-count">{ node.get("species_count") } species</span>
            : null
        }
    </span>
);

function App({ tree, dispatch }: {tree: Tree, dispatch: any}) {
    return <ReduxComponent tree={tree} dispatch={dispatch} renderTitle={renderTitle} />;
}

export default App;
