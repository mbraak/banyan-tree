import React from "react";
import { Tree } from "banyan-immutable-tree/lib/immutable_tree";
import { Node } from "banyan-immutable-tree/lib/immutable_node";

import { BaseTreeComponent, RenderNode } from "../base_tree_component";
import * as actions from "./actions";
import { KeyboardPlugin } from "../keyboard_plugin";

export type Dispatch = (...params: any[]) => void;

export interface ITreeComponentProps {
    tree: Tree;
    dispatch: Dispatch;
    renderTitle?: RenderNode;
    tree_id?: string;
    keyboardSupport?: boolean;
}

const ReduxTree = (
    { tree, dispatch, renderTitle, tree_id, keyboardSupport = true }: ITreeComponentProps
) => {
    const handleSelect = (node: Node) => {
        dispatch({
            type: actions.SELECT_NODE,
            node_id: node.get("id"),
            tree_id
        });
    };

    const handleToggle = (node: Node) => {
        dispatch({
            type: actions.TOGGLE_NODE,
            node_id: node.get("id"),
            tree_id
        });
    };

    const handleKey = (key: string) => {
        dispatch({
            type: actions.HANDLE_KEY,
            key,
            tree_id
        });

        return true;
    };

    const plugins = keyboardSupport ? [new KeyboardPlugin(handleKey)] : [];

    const props = {
        tree,
        onToggleNode: handleToggle,
        onSelectNode: handleSelect,
        renderTitle,
        plugins
    };

    return <BaseTreeComponent {...props} />;
};

export default ReduxTree;
