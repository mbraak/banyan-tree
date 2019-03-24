import React from "react";
import { Node, Tree } from "@banyan/immutable-tree";
import { BaseTreeComponent, RenderNode } from "@banyan/react-tree";
import { KeyboardPlugin } from "@banyan/react-tree";
import * as actions from "./actions";

export type Dispatch = (...params: any[]) => void;

export interface ITreeComponentProps {
    tree: Tree;
    dispatch: Dispatch;
    renderTitle?: RenderNode;
    tree_id?: string;
    keyboardSupport?: boolean;
}

const ReduxTree = ({
    tree,
    dispatch,
    renderTitle,
    tree_id,
    keyboardSupport = true
}: ITreeComponentProps) => {
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
