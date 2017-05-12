import React from "react";
import { observer } from "mobx-react";

import { BaseTreeComponent, RenderNode } from "../base_tree_component";
import TreeStore from "./tree_store";
import { KeyboardPlugin } from "../keyboard_plugin";

export interface IMobxTreeProps {
    tree_store: TreeStore;
    renderTitle?: RenderNode;
    keyboardSupport?: boolean;
}

const MobxTree = ({ tree_store, renderTitle, keyboardSupport = true }: IMobxTreeProps) => {
    const select = tree_store.select.bind(tree_store);
    const toggle = tree_store.toggle.bind(tree_store);
    const handleKey = tree_store.handleKey.bind(tree_store);

    const plugins = keyboardSupport ? [new KeyboardPlugin(handleKey)] : [];

    const props = {
        tree: tree_store.tree,
        renderTitle,
        onSelectNode: select,
        onToggleNode: toggle,
        plugins
    };

    return <BaseTreeComponent {...props} />;
};

export default observer(MobxTree);
