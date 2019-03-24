import { Tree } from "@banyan/immutable-tree/lib/immutable_tree";
export declare const createReducerForTreeId: (tree_id: string) => (tree: Tree, action: any) => Tree;
export declare function reduceTree(tree: Tree, action: any): Tree;
