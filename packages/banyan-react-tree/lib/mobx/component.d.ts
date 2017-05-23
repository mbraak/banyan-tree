/// <reference types="react" />
import React from "react";
import { RenderNode } from "../base_tree_component";
import TreeStore from "./tree_store";
export interface IMobxTreeProps {
    tree_store: TreeStore;
    renderTitle?: RenderNode;
    keyboardSupport?: boolean;
}
declare const _default: React.ClassicComponentClass<IMobxTreeProps>;
export default _default;
