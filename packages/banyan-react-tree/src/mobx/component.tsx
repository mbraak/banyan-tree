import React from "react";
import { observer } from "mobx-react";

import { BaseTreeComponent, RenderNode } from "../tree_component";
import TreeStore from "./tree_store";

export interface IMobxTreeProps {
    tree_store: TreeStore;
    renderTitle?: RenderNode;
}

const MobxTree = observer(
    ({ tree_store, renderTitle }: IMobxTreeProps) => {
    const select = tree_store.select.bind(tree_store);
    const toggle = tree_store.toggle.bind(tree_store);
    const handleKey = tree_store.handleKey.bind(tree_store);

    return (
        <BaseTreeComponent
            tree={tree_store.tree}
            renderTitle={renderTitle}
            onSelectNode={select}
            onToggleNode={toggle}
            onHandleKey={handleKey}
        />
    );
});

export default MobxTree;
