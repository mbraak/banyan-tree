import React from "react";

import TreeComponent from "../tree_component";

import type { Tree } from "../immutable_tree";


function App({ tree, dispatch }: {tree: Tree, dispatch: Function}) {
    return (
        <div>
            <TreeComponent tree={tree} dispatch={dispatch} />
        </div>
    );
}

export default App;
