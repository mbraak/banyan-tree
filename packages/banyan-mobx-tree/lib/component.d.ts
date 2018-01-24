/// <reference types="react" />
import { RenderNode } from "banyan-react-tree/lib/base_tree_component";
import TreeStore from "./tree_store";
export interface IMobxTreeProps {
    tree_store: TreeStore;
    renderTitle?: RenderNode;
    keyboardSupport?: boolean;
}
declare const _default: ({tree_store, renderTitle, keyboardSupport}: IMobxTreeProps) => JSX.Element;
export default _default;
