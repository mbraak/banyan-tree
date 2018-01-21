import { Map } from "immutable";
import * as node from "./immutable_node";
export class Tree {
    constructor(data = []) {
        this.root = node.create(data);
        this.ids = createIdMap(this.root);
        this.selected = null;
    }
    toString() {
        return node.toString(this.root);
    }
    getChildren() {
        return node.getChildren(this.root);
    }
    hasChildren() {
        return node.hasChildren(this.root);
    }
    addNode(child, parent) {
        if (!parent) {
            return this.addNodeToRoot(child);
        }
        else {
            return this.addNodeToParent(parent, child);
        }
    }
    getNodeByName(name) {
        const found_node = node.getNodeByName(this.root, name);
        if (!found_node) {
            return null;
        }
        else {
            return found_node.node;
        }
    }
    doGetNodeByName(name) {
        return node.doGetNodeByName(this.root, name).node;
    }
    removeNode(n) {
        const [new_root, affected_info] = node.removeNode(this.getReadonlyNode(n));
        return this.updateTree(new_root, affected_info.changed_nodes, affected_info.removed_nodes.map(removed_node => removed_node.get("id")));
    }
    getNodeById(id) {
        return this.ids.get(id);
    }
    doGetNodeById(id) {
        const result = this.getNodeById(id);
        if (!result) {
            throw Error(`Node with id '${id} not found`);
        }
        return result;
    }
    openNode(id) {
        const n = this.getNodeById(id);
        if (!n) {
            return this;
        }
        else {
            return this.updateNode(n, { is_open: true });
        }
    }
    closeNode(id) {
        const n = this.getNodeById(id);
        if (!n) {
            return this;
        }
        else {
            return this.updateNode(n, { is_open: false });
        }
    }
    isNodeOpen(id) {
        const n = this.getNodeById(id);
        if (!n) {
            return false;
        }
        else {
            return Boolean(n.get("is_open"));
        }
    }
    selectNode(id) {
        const t = this.deselect();
        const n = t.getNodeById(id);
        if (!n) {
            return t;
        }
        else {
            const new_tree = t.updateNode(n, { is_selected: true });
            new_tree.selected = id;
            return new_tree;
        }
    }
    toggleNode(id) {
        if (this.isNodeOpen(id)) {
            return this.closeNode(id);
        }
        else {
            return this.openNode(id);
        }
    }
    updateNode(n, attributes) {
        const [new_root, update_info] = node.updateNode(this.getReadonlyNode(n), attributes);
        return this.updateTree(new_root, update_info.changed_nodes, []);
    }
    openAllFolders() {
        let tree = this;
        for (const n of node.iterateTree(this.root)) {
            tree = tree.openNode(n.get("id"));
        }
        return tree;
    }
    openLevel(level) {
        let tree = this;
        for (const [n, node_level] of node.iterateTreeAndLevel(this.root)) {
            if (node_level <= level) {
                tree = tree.openNode(n.get("id"));
            }
        }
        return tree;
    }
    getSelectedNode() {
        if (!this.selected) {
            return null;
        }
        else {
            return this.getNodeById(this.selected);
        }
    }
    getIds() {
        return this.ids.keySeq().toArray();
    }
    getNodes() {
        return this.ids.valueSeq().toArray();
    }
    /*
        Change selected node based on key code.

        Returns [ is_handled, new_tree ]

        ```
        const [ is_handled, new_tree ] = tree.handleKey("ArrowDown");
        ```
    */
    handleKey(key) {
        const selected_node = this.getSelectedNode();
        if (!selected_node) {
            return [false, this];
        }
        else {
            const selectNode = (n) => n ? this.selectNode(n.get("id")) : this;
            switch (key) {
                case "ArrowUp":
                    return [
                        true,
                        selectNode(this.getPreviousNode(selected_node))
                    ];
                case "ArrowDown":
                    return [true, selectNode(this.getNextNode(selected_node))];
                case "ArrowRight":
                    if (!node.hasChildren(selected_node)) {
                        return [false, this];
                    }
                    else {
                        const is_open = selected_node.get("is_open");
                        if (is_open) {
                            // Right moves to the first child of an open node
                            return [
                                true,
                                selectNode(this.getNextNode(selected_node))
                            ];
                        }
                        else {
                            // Right expands a closed node
                            return [
                                true,
                                this.openNode(selected_node.get("id"))
                            ];
                        }
                    }
                case "ArrowLeft":
                    const is_open = selected_node.get("is_open");
                    if (node.hasChildren(selected_node) && is_open) {
                        // Left on an open node closes the node
                        return [true, this.closeNode(selected_node.get("id"))];
                    }
                    else {
                        // Left on a closed or end node moves focus to the node's parent
                        const parent_id = selected_node.get("parent_id");
                        if (parent_id === null) {
                            return [false, this];
                        }
                        else {
                            return [true, this.selectNode(parent_id)];
                        }
                    }
                default:
                    return [false, this];
            }
        }
    }
    getNextNode(n) {
        return node.getNextNode(this.getReadonlyNode(n));
    }
    getPreviousNode(n) {
        return node.getPreviousNode(this.getReadonlyNode(n));
    }
    addNodeToRoot(child) {
        const [new_root, update_info] = node.addNode(this.root, child);
        return this.updateTree(new_root, [update_info.new_child], []);
    }
    addNodeToParent(parent, child) {
        const readonly_parent = this.getReadonlyNode(parent);
        const [new_root, update_info] = node.addNode(this.root, readonly_parent, child);
        return this.updateTree(new_root, update_info.changed_nodes.concat([update_info.new_child]), []);
    }
    getReadonlyNode(n) {
        return {
            node: n,
            parents: this.getParents(n)
        };
    }
    getParents(n) {
        if (n.get("is_root")) {
            return [];
        }
        else {
            const parents = [];
            let current_node = n;
            while (current_node && current_node.get("parent_id")) {
                const parent = this.getNodeById(current_node.get("parent_id"));
                if (parent) {
                    parents.push(parent);
                }
                current_node = parent;
            }
            parents.push(this.root);
            return parents;
        }
    }
    updateTree(new_root, updated_nodes, deleted_ids) {
        const new_ids = this.updateIds(updated_nodes, deleted_ids);
        const new_tree = this.createCopy();
        new_tree.ids = new_ids;
        new_tree.root = new_root;
        return new_tree;
    }
    createCopy() {
        const new_tree = new Tree();
        new_tree.ids = this.ids;
        new_tree.root = this.root;
        new_tree.selected = this.selected;
        return new_tree;
    }
    updateIds(updated_nodes, deleted_ids) {
        const updates_node_map = Map(updated_nodes.map((n) => [n.get("id"), n]));
        let new_ids = this.ids.merge(updates_node_map);
        deleted_ids.forEach(id => {
            new_ids = new_ids.delete(id);
        });
        return new_ids;
    }
    deselect() {
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
function createIdMap(root) {
    function* iteratePairs() {
        for (const n of node.iterateTree(root)) {
            yield [n.get("id"), n];
        }
    }
    return Map(iteratePairs());
}
//# sourceMappingURL=immutable_tree.js.map