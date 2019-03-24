import * as React from "react";

import { Tree } from "@banyan/immutable-tree/lib/immutable_tree";

import { TreeComponent } from "../src/tree_component";
import renderTitle from "./render_title";

function App({ tree }: { tree: Tree }) {
    return <TreeComponent tree={tree} renderTitle={renderTitle} />;
}

export default App;
