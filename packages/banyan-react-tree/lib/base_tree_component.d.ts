/// <reference types="react" />
import React from "react";
import { Tree } from "banyan-immutable-tree/lib/immutable_tree";
import { Node } from "banyan-immutable-tree/lib/immutable_node";
import { Plugin, ITreeProxy } from "./plugin";
export declare type RenderNode = (node: Node) => JSX.Element;
export declare type NodeCallback = (node: Node) => void;
export declare type SetTreeElement = (instance: HTMLUListElement) => any;
export interface IBaseTreeComponentProps {
    tree: Tree;
    onToggleNode?: NodeCallback;
    onSelectNode?: NodeCallback;
    renderTitle?: RenderNode;
    plugins?: Plugin[];
}
export declare class BaseTreeComponent extends React.Component<IBaseTreeComponentProps> implements ITreeProxy {
    private root_element?;
    private plugins;
    constructor(props: IBaseTreeComponentProps);
    render(): JSX.Element;
    componentDidMount(): void;
    componentWillUnmount(): void;
    getElement(): Element | undefined;
    private setRootElement(element);
    private connectPlugins();
}
