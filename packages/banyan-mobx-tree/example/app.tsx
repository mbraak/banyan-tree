import * as React from "react";
import DevTools from "mobx-react-devtools";

import renderTitle from "./render_title";
import MobxTree from "../src/component";
import TreeStore from "../src/tree_store";

export interface IAppProps {
    treeStore: TreeStore;
}

export const App = ({ treeStore }: IAppProps) => (
    <div>
        <MobxTree tree_store={treeStore} renderTitle={renderTitle} />
        <DevTools />
    </div>
);
