import { Tree } from "@banyan/immutable-tree/lib/immutable_tree";
import { Node } from "@banyan/immutable-tree/lib/immutable_node";
export default class TreeStore {
    tree: Tree;
    constructor(tree: Tree);
    select(node: Node): void;
    toggle(node: Node): void;
    handleKey(key: string): any;
}
