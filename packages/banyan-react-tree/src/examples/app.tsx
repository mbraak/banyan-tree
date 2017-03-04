import React from "react";

import TreeComponent from "../tree_component";
import { Tree } from "../immutable_tree";

function App({ tree, dispatch }: {tree: Tree, dispatch: any}) {
    return <TreeComponent tree={tree} dispatch={dispatch} />;
}

export default App;
