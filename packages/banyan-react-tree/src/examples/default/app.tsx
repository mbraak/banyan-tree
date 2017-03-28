import React from "react";

import { TreeComponent } from "../../tree_component";
import { Tree } from "../../immutable_tree";
import renderTitle from "../render_title";

function App({ tree }: { tree: Tree }) {
    return <TreeComponent tree={tree} renderTitle={renderTitle} />;
}

export default App;
