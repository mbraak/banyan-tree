import * as React from "react";

import renderTitle from "./render_title";
import MobxTree from "../src/component";
import TreeStore from "../src/tree_store";

export interface IAppProps {
    tree_store: TreeStore;
}

export const App = ({ tree_store }: IAppProps) => (
    <MobxTree tree_store={tree_store} renderTitle={renderTitle} />
);
