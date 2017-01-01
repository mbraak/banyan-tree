/* @flow */

import { Map, List } from "immutable";

import * as node from "./immutable_node";

const { Node } = node;


export class Tree {
    root: Node;
    ids: Map<number, Node>;
    selected: ?number;

    constructor(data: Array<Object> = []) {
        this.root = node.create(data);
        this.ids = createIdMap(this.root);

        this.selected = null;
    }

    toString(): string {
        return node.toString(this.root);
    }

    getChildren(): List<Node> {
        return node.getChildren(this.root);
    }

    hasChildren(): boolean {
        return node.hasChildren(this.root);
    }

    addNode(parent: Node|Object, child: ?Object): Tree {
        if (!child) {
            return this._addNodeToRoot(parent);
        }
        else {
            return this._addNodeToParent(parent, child);
        }
    }

    getNodeByName(name: string): ?Node {
        const found_node = node.getNodeByName(this.root, name);

        if (!found_node) {
            return null;
        }
        else {
            return found_node.node;
        }
    }

    removeNode(n: Node): Tree {
        const [new_root, affected_info] = node.removeNode(this._getReadonlyNode(n));

        return this._updateTree(
            new_root,
            affected_info.changed_nodes,
            affected_info.removed_nodes.map(removed_node => removed_node.id)
        );
    }

    getNodeById(id: number): ?Node {
        return this.ids.get(id);
    }

    openNode(id: number): Tree {
        const n = this.getNodeById(id);

        if (!n) {
            return this;
        }
        else {
            return this.updateNode(n, { is_open: true });
        }
    }

    closeNode(id: number): Tree {
        const n = this.getNodeById(id);

        if (!n) {
            return this;
        }
        else {
            return this.updateNode(n, { is_open: false });
        }
    }

    isNodeOpen(id: number): boolean {
        const n = this.getNodeById(id);

        if (!n) {
            return false;
        }
        else {
            return Boolean(n.is_open);
        }
    }

    selectNode(id: number): Tree {
        const new_tree = this._createCopy();
        new_tree.selected = id;

        return new_tree;
    }

    toggleNode(id: number): Tree {
        if (this.isNodeOpen(id)) {
            return this.closeNode(id);
        }
        else {
            return this.openNode(id);
        }
    }

    updateNode(n: Node, attributes: Object): Tree {
        const [new_root, update_info] = node.updateNode(
            this._getReadonlyNode(n),
            attributes
        );

        return this._updateTree(new_root, update_info.changed_nodes, []);
    }

    _addNodeToRoot(child: Object): Tree {
        const [new_root, update_info] = node.addNode(this.root, child);

        return this._updateTree(new_root, [update_info.new_child], []);
    }

    _addNodeToParent(parent: Node, child: Object): Tree {
        const readonly_parent = this._getReadonlyNode(parent);
        const [new_root, update_info] = node.addNode(this.root, readonly_parent, child);

        return this._updateTree(
            new_root,
            update_info.changed_nodes.concat([update_info.new_child]),
            []
        );
    }

    _getReadonlyNode(n: Node): Object {
        return {
            node: n,
            parents: this._getParents(n)
        };
    }

    _getParents(n: Node): Array<Node> {
        if (node.is_root) {
            return [];
        }
        else {
            const parents = [];
            let current_node = n;

            while (current_node.parent_id) {
                const parent = this.getNodeById(current_node.parent_id);
                parents.push(parent);
                current_node = parent;
            }

            parents.push(this.root);

            return parents;
        }
    }

    _updateTree(new_root: Node, updated_nodes: Array<Node>, deleted_ids: Array<number>): Object {
        const new_ids = this._updateIds(updated_nodes, deleted_ids);

        const new_tree = this._createCopy();

        new_tree.ids = new_ids;
        new_tree.root = new_root;

        return new_tree;
    }

    _createCopy() {
        const new_tree = new Tree();

        new_tree.ids = this.ids;
        new_tree.root = this.root;
        new_tree.selected = this.selected;

        return new_tree;
    }

    _updateIds(updated_nodes: Array<Node>, deleted_ids: Array<number>): Map<number, Node> {
        let new_ids = this.ids.merge(
            updated_nodes.map(n => [n.id, n])
        );

        deleted_ids.forEach(id => {
            new_ids = new_ids.delete(id);
        });

        return new_ids;
    }
}

function createIdMap(root: Node): Map<number, Node> {
    function* iteratePairs() {
        for (const n of node.iterateTree(root)) {
            yield [n.id, n];
        }
    }

    return new Map(iteratePairs());
}
