"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_1 = require("immutable");
const lodash_1 = require("lodash");
const createEmptyTree = () => createNode({ isRoot: true });
const createNode = (data) => immutable_1.Map(data);
const createNodesFromData = (parentId, childrenData) => immutable_1.List(childrenData.map(nodeData => createNodeFromData(parentId, nodeData)));
function createNodeFromData(parentId, nodeData) {
    function createChildren() {
        if (!nodeData.children) {
            return null;
        }
        else {
            return createNodesFromData(nodeData.id, nodeData.children);
        }
    }
    return immutable_1.Map(nodeData)
        .set("parentId", parentId)
        .set("children", createChildren());
}
function create(childrenData) {
    function createChildren() {
        if (childrenData) {
            return createNodesFromData(null, childrenData);
        }
        else {
            return immutable_1.List();
        }
    }
    return createEmptyTree().set("children", createChildren());
}
exports.create = create;
function nodesToString(nodes) {
    return nodes.map(toString).join(" ");
}
function toString(node) {
    if (!node) {
        return "";
    }
    const children = getChildren(node);
    const hasChildren = !children.isEmpty();
    const isRoot = node.get("isRoot");
    const name = node.get("name");
    if (isRoot) {
        if (!hasChildren) {
            return "";
        }
        else {
            return nodesToString(children);
        }
    }
    else if (!hasChildren) {
        return name;
    }
    else {
        return `${name}(${nodesToString(children)})`;
    }
}
exports.toString = toString;
function nodeListToString(nodes) {
    return nodes
        .map(n => {
        if (n.get("isRoot")) {
            return "[root]";
        }
        else {
            return n.get("name");
        }
    })
        .join(" ");
}
exports.nodeListToString = nodeListToString;
function hasChildren(node) {
    const children = node.get("children");
    if (!children) {
        return false;
    }
    else {
        return !children.isEmpty();
    }
}
exports.hasChildren = hasChildren;
function getChildren(node) {
    const children = node.get("children");
    if (children) {
        return children;
    }
    else {
        return immutable_1.List();
    }
}
exports.getChildren = getChildren;
/* Iterates over tree. Return [node parents] pairs.
  - generator
  - walks depth-first
*/
function treeSeqPath(isBranch, getChildren, root) {
    function* walk(path, node) {
        yield [node, path.toArray()];
        if (isBranch(node)) {
            const children = getChildren(node);
            const newPath = path.push(node);
            for (const child of children) {
                yield* walk(newPath, child);
            }
        }
    }
    return walk(immutable_1.List(), root);
}
// Iterate tree; return lazy sequence of readonly nodes
// - skip root
function* iterateTreeWithParents(root) {
    for (const [node, parents] of treeSeqPath(hasChildren, getChildren, root)) {
        if (node !== root) {
            yield { node, parents };
        }
    }
}
function treeSeq(isBranch, getChildren, root, includeRoot) {
    function* walk(node, level) {
        if (node !== root || includeRoot) {
            yield [node, level];
        }
        if (isBranch(node)) {
            for (const child of getChildren(node)) {
                yield* walk(child, level + 1);
            }
        }
    }
    return walk(root, 0);
}
function* iterateTree(root, includeRoot = false) {
    for (const [node] of treeSeq(hasChildren, getChildren, root, includeRoot)) {
        yield node;
    }
}
exports.iterateTree = iterateTree;
function* iterateTreeAndLevel(root) {
    yield* treeSeq(hasChildren, getChildren, root, false);
}
exports.iterateTreeAndLevel = iterateTreeAndLevel;
// Find node by name; return readonly node or nil
function getNodeByName(root, name) {
    for (const readonlyNode of iterateTreeWithParents(root)) {
        if (readonlyNode.node.get("name") === name) {
            const { node, parents } = readonlyNode;
            return {
                node,
                parents: parents.reverse()
            };
        }
    }
    return null;
}
exports.getNodeByName = getNodeByName;
function doGetNodeByName(root, name) {
    const result = getNodeByName(root, name);
    if (!result) {
        throw Error(`Node ${name} not found`);
    }
    return result;
}
exports.doGetNodeByName = doGetNodeByName;
// Add node
//  - return [new-root {new-child changed-nodes}]
function addNode(root, readonlyParent, childData) {
    if (childData) {
        return addNodeToNonRoot(readonlyParent, createNode(childData));
    }
    else {
        const data = readonlyParent;
        return addNodeToRoot(root, createNode(data));
    }
}
exports.addNode = addNode;
function addNodeToNonRoot(readonlyParent, child) {
    const parent = readonlyParent.node;
    const newChild = child.set("parentId", parent.get("id"));
    const newParent = addChild(parent, newChild);
    const [new_root, changedNodes] = updateParents(parent, newParent, readonlyParent.parents);
    return [
        new_root,
        {
            newChild,
            changedNodes: [newParent].concat(changedNodes)
        }
    ];
}
function addNodeToRoot(root, child) {
    const newRoot = addChild(root, child);
    return [
        newRoot,
        {
            newChild: child,
            changedNodes: []
        }
    ];
}
function addChild(parent, child) {
    const children = getChildren(parent);
    return parent.set("children", children.push(child));
}
/*
  Update parent of updated-node; also update the parents of the parent

  - 'old-child' is replaced by 'new-child'
  - 'parents' are the parents of the child; direct parent first
  - returns: [new root, affected]
*/
function updateParents(initialOldChild, intitialNewChild, parents) {
    if (parents.length === 0) {
        throw new Error("updateParents: parents cannot be empty");
    }
    let oldChild = initialOldChild;
    let newChild = intitialNewChild;
    const newParents = parents.map(parent => {
        const newParent = replaceChild(parent, oldChild, newChild);
        oldChild = parent;
        newChild = newParent;
        return newParent;
    });
    return [lodash_1.last(newParents), lodash_1.dropRight(newParents)];
}
function replaceChild(node, oldChild, newChild) {
    const children = getChildren(node);
    const childIndex = children.indexOf(oldChild);
    const newChildren = children.set(childIndex, newChild);
    return node.set("children", newChildren);
}
/*
  Remove node
  - return {new_root changed_nodes removed_nodes}
*/
function removeNode(readonlyChild) {
    const child = readonlyChild.node;
    const { parents } = readonlyChild;
    const parent = lodash_1.first(parents);
    if (!parent) {
        throw new Error("removeNode: child has no parent");
    }
    if (parent.get("isRoot")) {
        return removeNodeFromRoot(parent, child);
    }
    else {
        return removeNodeFromParent(parents, child);
    }
}
exports.removeNode = removeNode;
function removeNodeFromRoot(root, child) {
    const newRoot = removeChild(root, child);
    const removedNodes = Array.from(iterateTree(child, true));
    return [
        newRoot,
        {
            changedNodes: [],
            removedNodes
        }
    ];
}
function removeNodeFromParent(parents, child) {
    const parent = lodash_1.first(parents);
    if (!parent) {
        throw new Error("removeNodeFromParent: parents cannot be empty");
    }
    const newParent = removeChild(parent, child);
    const [newRoot, changedParents] = updateParents(parent, newParent, lodash_1.tail(parents));
    const removedNodes = Array.from(iterateTree(child, true));
    return [
        newRoot,
        {
            changedNodes: [newParent].concat(changedParents),
            removedNodes
        }
    ];
}
function removeChild(node, child) {
    const children = getChildren(node);
    const childIndex = children.indexOf(child);
    const newChildren = children.delete(childIndex);
    return node.set("children", newChildren);
}
function updateNode(readonlyNode, attributes) {
    const { node, parents } = readonlyNode;
    const newNode = node.merge(attributes);
    const [newRoot, changedParents] = updateParents(node, newNode, parents);
    return [
        newRoot,
        {
            changedNodes: [newNode].concat(changedParents)
        }
    ];
}
exports.updateNode = updateNode;
function getNextNode(readonlyNode, includeChildren = true) {
    const { node } = readonlyNode;
    if (includeChildren && hasChildren(node) && node.get("isOpen")) {
        // First child
        return getChildren(node).first();
    }
    else {
        const nextSibling = getNextSibling(readonlyNode);
        if (nextSibling) {
            // Next sibling
            return nextSibling;
        }
        else {
            const readonlyParent = getReadonlyParent(readonlyNode);
            if (!readonlyParent) {
                return undefined;
            }
            else {
                return getNextNode(readonlyParent, false);
            }
        }
    }
}
exports.getNextNode = getNextNode;
function getReadonlyParent(node) {
    const { parents } = node;
    const parent = lodash_1.first(parents);
    if (!parent) {
        return null;
    }
    else {
        return {
            node: parent,
            parents: lodash_1.tail(parents)
        };
    }
}
function getPreviousNode(readonlyNode) {
    const previousSibling = getPreviousSibling(readonlyNode);
    if (!previousSibling) {
        // Parent
        const parent = lodash_1.first(readonlyNode.parents);
        if (!parent) {
            throw new Error("Child has no parent");
        }
        if (parent.get("isRoot")) {
            return undefined;
        }
        else {
            return parent;
        }
    }
    else {
        if (!hasChildren(previousSibling) || !previousSibling.get("isOpen")) {
            // Previous sibling
            return previousSibling;
        }
        else {
            // Last child of previous sibling
            return getLastChild(previousSibling);
        }
    }
}
exports.getPreviousNode = getPreviousNode;
function getChildIndex(parent, child) {
    const index = getChildren(parent).indexOf(child);
    if (index === -1) {
        return null;
    }
    else {
        return index;
    }
}
function getNextSibling(readonlyNode) {
    const { node, parents } = readonlyNode;
    const parent = lodash_1.first(parents);
    if (!parent) {
        return undefined;
    }
    else {
        const childIndex = getChildIndex(parent, node);
        if (childIndex === null) {
            return undefined;
        }
        else {
            return getChildren(parent).get(childIndex + 1);
        }
    }
}
function getPreviousSibling(readonlyNode) {
    const { node, parents } = readonlyNode;
    const parent = lodash_1.first(parents);
    if (!parent) {
        return undefined;
    }
    else {
        const childIndex = getChildIndex(parent, node);
        if (childIndex === null || childIndex === 0) {
            return undefined;
        }
        else {
            return getChildren(parent).get(childIndex - 1);
        }
    }
}
function getLastChild(node) {
    if (!hasChildren(node)) {
        return undefined;
    }
    else {
        const lastChild = getChildren(node).last(undefined);
        if (!lastChild) {
            return undefined;
        }
        if (!hasChildren(lastChild) || !lastChild.get("isOpen")) {
            return lastChild;
        }
        else {
            return getLastChild(lastChild);
        }
    }
}
//# sourceMappingURL=immutable_node.js.map