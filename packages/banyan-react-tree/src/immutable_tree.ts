import { List, Map } from "immutable";

import * as node from "./immutable_node";
import { Node, NodeId, INodeData, IReadonlyNode } from "./immutable_node";

export class Tree {
    public root: Node;
    private ids: Map<NodeId, Node>;
    private selected: NodeId|null;

    constructor(data: INodeData[] = []) {
        this.root = node.create(data);
        this.ids = createIdMap(this.root);

        this.selected = null;
    }

    public toString(): string {
        return node.toString(this.root);
    }

    public getChildren(): List<Node> {
        return node.getChildren(this.root);
    }

    public hasChildren(): boolean {
        return node.hasChildren(this.root);
    }

    // todo: reverse params
    public addNode(parent: Node|INodeData, child?: INodeData): Tree {
        if (!child) {
            return this._addNodeToRoot(parent as INodeData);
        }
        else {
            return this._addNodeToParent(parent as Node, child as INodeData);
        }
    }

    public getNodeByName(name: string): Node|null {
        const found_node = node.getNodeByName(this.root, name);

        if (!found_node) {
            return null;
        }
        else {
            return found_node.node;
        }
    }

    public removeNode(n: Node): Tree {
        const [new_root, affected_info] = node.removeNode(this._getReadonlyNode(n));

        return this._updateTree(
            new_root,
            affected_info.changed_nodes,
            affected_info.removed_nodes.map(removed_node => removed_node.id)
        );
    }

    public getNodeById(id: NodeId): Node|null {
        return this.ids.get(id);
    }

    public openNode(id: NodeId): Tree {
        const n = this.getNodeById(id);

        if (!n) {
            return this;
        }
        else {
            return this.updateNode(n, { is_open: true });
        }
    }

    public closeNode(id: NodeId): Tree {
        const n = this.getNodeById(id);

        if (!n) {
            return this;
        }
        else {
            return this.updateNode(n, { is_open: false });
        }
    }

    public isNodeOpen(id: NodeId): boolean {
        const n = this.getNodeById(id);

        if (!n) {
            return false;
        }
        else {
            return Boolean(n.is_open);
        }
    }

    public selectNode(id: NodeId): Tree {
        const t = this._deselect();
        const n = t.getNodeById(id);

        if (!n) {
            return t;
        }
        else {
            t.selected = id;
            return t.updateNode(n, { is_selected: true });
        }
    }

    public toggleNode(id: NodeId): Tree {
        if (this.isNodeOpen(id)) {
            return this.closeNode(id);
        }
        else {
            return this.openNode(id);
        }
    }

    public updateNode(n: Node, attributes: Object): Tree {
        const [new_root, update_info] = node.updateNode(
            this._getReadonlyNode(n),
            attributes
        );

        return this._updateTree(new_root, update_info.changed_nodes, []);
    }

    private _addNodeToRoot(child: INodeData): Tree {
        const [new_root, update_info] = node.addNode(this.root, child);

        return this._updateTree(new_root, [update_info.new_child], []);
    }

    private _addNodeToParent(parent: Node, child: INodeData): Tree {
        const readonly_parent = this._getReadonlyNode(parent);
        const [new_root, update_info] = node.addNode(this.root, readonly_parent, child);

        return this._updateTree(
            new_root,
            update_info.changed_nodes.concat([update_info.new_child]),
            []
        );
    }

    private _getReadonlyNode(n: Node): IReadonlyNode {
        return {
            node: n,
            parents: this._getParents(n)
        };
    }

    private _getParents(n: Node): Node[] {
        if (n.is_root) {
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

    private _updateTree(new_root: Node, updated_nodes: Node[], deleted_ids: NodeId[]): Tree {
        const new_ids = this._updateIds(updated_nodes, deleted_ids);

        const new_tree = this._createCopy();

        new_tree.ids = new_ids;
        new_tree.root = new_root;

        return new_tree;
    }

    private _createCopy(): Tree {
        const new_tree = new Tree();

        new_tree.ids = this.ids;
        new_tree.root = this.root;
        new_tree.selected = this.selected;

        return new_tree;
    }

    private _updateIds(updated_nodes: Node[], deleted_ids: NodeId[]): Map<NodeId, Node> {
        const updates_node_map = Map<NodeId, Node>(
            updated_nodes.map(
                (n: Node) => ([n.id, n])
            )
        );

        let new_ids = this.ids.merge(updates_node_map);

        deleted_ids.forEach(id => {
            new_ids = new_ids.delete(id);
        });

        return new_ids;
    }

    private _deselect(): Tree {
        if (!this.selected) {
            return this;
        }
        else {
            const n = this.getNodeById(this.selected);

            if (!n) {
                return this;
            }
            else {
                const new_tree = this.updateNode(n, { is_selected: false });
                new_tree.selected = null;

                return new_tree;
            }
        }
    }
}

function createIdMap(root: Node): Map<NodeId, Node> {
    function* iteratePairs() {
        for (const n of node.iterateTree(root)) {
            yield [n.id, n];
        }
    }

    return Map<NodeId, Node>(iteratePairs());
}
