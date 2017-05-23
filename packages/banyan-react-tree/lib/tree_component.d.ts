/// <reference types="react" />
import React from "react";
import { Tree } from "banyan-immutable-tree/lib/immutable_tree";
import { RenderNode } from "./base_tree_component";
export interface ITreeComponentProps {
    tree: Tree;
    renderTitle?: RenderNode;
    keyboardSupport?: boolean;
}
export interface ITreeComponentState {
    tree: Tree;
}
export declare class TreeComponent extends React.Component<ITreeComponentProps, ITreeComponentState> {
    static defaultProps: Partial<ITreeComponentProps>;
    constructor(props: ITreeComponentProps);
    render(): JSX.Element;
    private handleToggle(node);
    private handleSelect(node);
    private handleKey(key);
}
