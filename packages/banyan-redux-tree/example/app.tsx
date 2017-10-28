import React from "react";
import { Tree } from "banyan-immutable-tree/lib/immutable_tree";

import ReduxComponent from "../src/component";
import renderTitle from "./render_title";

function App({ tree, dispatch }: { tree: Tree; dispatch: any }) {
    return (
        <ReduxComponent
            tree={tree}
            dispatch={dispatch}
            renderTitle={renderTitle}
            tree_id="example"
        />
    );
}

export default App;
