import { observable } from "mobx";

import { Tree } from "../immutable_tree";
import { Node } from "../immutable_node";

export default class TreeStore {
    @observable public tree: Tree;

    constructor(tree: Tree) {
        this.tree = tree;
    }

    public select(node: Node) {
        this.tree = this.tree.selectNode(node.get("id"));
    }

    public toggle(node: Node) {
        this.tree = this.tree.toggleNode(node.get("id"));
    }

    public handleKey(key: string) {
        this.tree = this.tree.handleKey(key);
    }
}
