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
}

export default function ReduxTree({ tree, dispatch, renderTitle }: ITreeComponentProps) {
    const handleSelect = (node: Node) => {
        dispatch({
            type: actions.SELECT_NODE,
            node_id: node.get("id")
        });
    };

    const handleToggle = (node: Node) => {
        dispatch({
            type: actions.TOGGLE_NODE,
            node_id: node.get("id")
        });
    };

    return (
        <BaseTreeComponent tree={tree} onToggleNode={handleToggle} onSelectNode={handleSelect} renderTitle={renderTitle} />
    );
}
