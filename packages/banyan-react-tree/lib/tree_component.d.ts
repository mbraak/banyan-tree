/// <reference types="react" />
import { Tree } from "./immutable_tree";
export declare type Dispatch = (...params: any[]) => void;
export default function TreeComponent({tree, dispatch}: {
    tree: Tree;
    dispatch: Dispatch;
}): JSX.Element;
