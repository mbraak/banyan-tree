import React from "react";

import ReduxComponent from "../../redux/component";
import { Tree } from "../../immutable_tree";
import renderTitle from "../render_title";

function App({ tree, dispatch }: { tree: Tree, dispatch: any }) {
    return (
        <ReduxComponent tree={tree} dispatch={dispatch} renderTitle={renderTitle} tree_id="example" />
    );
}

export default App;
