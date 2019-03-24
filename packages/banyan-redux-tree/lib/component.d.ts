/// <reference types="react" />
import { Tree } from "@banyan/immutable-tree";
import { RenderNode } from "@banyan/react-tree";
export declare type Dispatch = (...params: any[]) => void;
export interface ITreeComponentProps {
    tree: Tree;
    dispatch: Dispatch;
    renderTitle?: RenderNode;
    tree_id?: string;
    keyboardSupport?: boolean;
}
declare const ReduxTree: ({ tree, dispatch, renderTitle, tree_id, keyboardSupport }: ITreeComponentProps) => JSX.Element;
export default ReduxTree;
//# sourceMappingURL=component.d.ts.map