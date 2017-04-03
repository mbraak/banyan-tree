import React from "react";

import { BaseTreeComponent, RenderNode } from "../tree_component";
import * as actions from "./actions";
import { Tree } from "../immutable_tree";
import { Node } from "../immutable_node";

export type Dispatch = (...params: any[]) => void;

export interface ITreeComponentProps {
    tree: Tree;
    dispatch: Dispatch;
    renderTitle?: RenderNode;
    tree_id?: string;
}

export default function ReduxTree({ tree, dispatch, renderTitle, tree_id }: ITreeComponentProps) {
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

    return (
        <BaseTreeComponent
            tree={tree}
            onToggleNode={handleToggle}
            onSelectNode={handleSelect}
            renderTitle={renderTitle}
            onHandleKey={handleKey}
        />
    );
}
