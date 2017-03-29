import React from "react";
import { observer } from "mobx-react";

import { BaseTreeComponent } from "../../tree_component";
import renderTitle from "../render_title";
import TreeStore from "../../mobx/tree_store";

export interface IAppProps {
    tree_store: TreeStore;
}

export const App = observer(
    ({ tree_store }: IAppProps) => {
        const select = tree_store.select.bind(tree_store);
        const toggle = tree_store.toggle.bind(tree_store);

        return (
            <BaseTreeComponent
                tree={tree_store.tree} renderTitle={renderTitle}
                onSelectNode={select} onToggleNode={toggle}
            />
        );
    }
);
