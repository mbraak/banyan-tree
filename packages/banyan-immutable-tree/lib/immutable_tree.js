"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_1 = require("immutable");
const node = __importStar(require("./immutable_node"));
class Tree {
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
        const foundNode = node.getNodeByName(this.root, name);
        if (!foundNode) {
            return null;
        }
        else {
            return foundNode.node;
        }
    }
    doGetNodeByName(name) {
        return node.doGetNodeByName(this.root, name).node;
    }
    removeNode(n) {
        const [newRoot, affectedInfo] = node.removeNode(this.getReadonlyNode(n));
        return this.updateTree(newRoot, affectedInfo.changedNodes, affectedInfo.removedNodes.map(removedNode => removedNode.get("id")));
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
            return this.updateNode(n, { isOpen: true });
        }
    }
    closeNode(id) {
        const n = this.getNodeById(id);
        if (!n) {
            return this;
        }
        else {
            return this.updateNode(n, { isOpen: false });
        }
    }
    isNodeOpen(id) {
        const n = this.getNodeById(id);
        if (!n) {
            return false;
        }
        else {
            return Boolean(n.get("isOpen"));
        }
    }
    selectNode(id) {
        const t = this.deselect();
        const n = t.getNodeById(id);
        if (!n) {
            return t;
        }
        else {
            const newTree = t.updateNode(n, { isSelected: true });
            newTree.selected = id;
            return newTree;
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
        const [newRoot, updateInfo] = node.updateNode(this.getReadonlyNode(n), attributes);
        return this.updateTree(newRoot, updateInfo.changedNodes, []);
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
        for (const [n, nodeLevel] of node.iterateTreeAndLevel(this.root)) {
            if (nodeLevel <= level) {
                tree = tree.openNode(n.get("id"));
            }
        }
        return tree;
    }
    getSelectedNode() {
        if (!this.selected) {
            return undefined;
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

        Returns [ isHandled, newTree ]

        ```
        const [ isHandled, newTree ] = tree.handleKey("ArrowDown");
        ```
    */
    handleKey(key) {
        const selectedNode = this.getSelectedNode();
        if (!selectedNode) {
            return [false, this];
        }
        else {
            const selectNode = (n) => n ? this.selectNode(n.get("id")) : this;
            switch (key) {
                case "ArrowUp":
                    return [
                        true,
                        selectNode(this.getPreviousNode(selectedNode))
                    ];
                case "ArrowDown":
                    return [true, selectNode(this.getNextNode(selectedNode))];
                case "ArrowRight":
                    if (!node.hasChildren(selectedNode)) {
                        return [false, this];
                    }
                    else {
                        const isOpen = selectedNode.get("isOpen");
                        if (isOpen) {
                            // Right moves to the first child of an open node
                            return [
                                true,
                                selectNode(this.getNextNode(selectedNode))
                            ];
                        }
                        else {
                            // Right expands a closed node
                            return [
                                true,
                                this.openNode(selectedNode.get("id"))
                            ];
                        }
                    }
                case "ArrowLeft":
                    const isOpen = selectedNode.get("isOpen");
                    if (node.hasChildren(selectedNode) && isOpen) {
                        // Left on an open node closes the node
                        return [true, this.closeNode(selectedNode.get("id"))];
                    }
                    else {
                        // Left on a closed or end node moves focus to the node's parent
                        const parentId = selectedNode.get("parentId");
                        if (parentId === null) {
                            return [false, this];
                        }
                        else {
                            return [true, this.selectNode(parentId)];
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
        const [newRoot, updateInfo] = node.addNode(this.root, child);
        return this.updateTree(newRoot, [updateInfo.newChild], []);
    }
    addNodeToParent(parent, child) {
        const readonlyParent = this.getReadonlyNode(parent);
        const [newRoot, updateInfo] = node.addNode(this.root, readonlyParent, child);
        return this.updateTree(newRoot, updateInfo.changedNodes.concat([updateInfo.newChild]), []);
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
            let currentNode = n;
            while (currentNode && currentNode.get("parentId")) {
                const parent = this.getNodeById(currentNode.get("parentId"));
                if (parent) {
                    parents.push(parent);
                }
                currentNode = parent;
            }
            parents.push(this.root);
            return parents;
        }
    }
    updateTree(newRoot, updatedNodes, deletedIds) {
        const newIds = this.updateIds(updatedNodes, deletedIds);
        const newTree = this.createCopy();
        newTree.ids = newIds;
        newTree.root = newRoot;
        return newTree;
    }
    createCopy() {
        const newTree = new Tree();
        newTree.ids = this.ids;
        newTree.root = this.root;
        newTree.selected = this.selected;
        return newTree;
    }
    updateIds(updatedNodes, deletedIds) {
        const tuples = updatedNodes.map((n) => [n.get("id"), n]);
        const updatedNodeMap = immutable_1.Map(tuples);
        let newIds = this.ids.merge(updatedNodeMap);
        deletedIds.forEach(id => {
            newIds = newIds.delete(id);
        });
        return newIds;
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
                const newTree = this.updateNode(n, { is_selected: false });
                newTree.selected = null;
                return newTree;
            }
        }
    }
}
exports.Tree = Tree;
function createIdMap(root) {
    function* iteratePairs() {
        for (const n of node.iterateTree(root)) {
            yield [n.get("id"), n];
        }
    }
    return immutable_1.Map(iteratePairs());
}
//# sourceMappingURL=immutable_tree.js.map