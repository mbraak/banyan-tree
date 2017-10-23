/// <reference types="react" />
import { Tree } from "banyan-immutable-tree/lib/immutable_tree";
import { RenderNode } from "../base_tree_component";
export declare type Dispatch = (...params: any[]) => void;
export interface ITreeComponentProps {
    tree: Tree;
    dispatch: Dispatch;
    renderTitle?: RenderNode;
    tree_id?: string;
    keyboardSupport?: boolean;
}
declare const ReduxTree: ({tree, dispatch, renderTitle, tree_id, keyboardSupport}: ITreeComponentProps) => JSX.Element;
export default ReduxTree;
