/// <reference types="react" />
import { RenderNode } from "../base_tree_component";
import { Tree } from "../immutable_tree";
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
