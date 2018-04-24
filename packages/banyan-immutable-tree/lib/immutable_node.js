"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_1 = require("immutable");
const lodash_1 = require("lodash");
const createEmptyTree = () => createNode({ is_root: true });
const createNode = (data) => immutable_1.Map(data);
const createNodesFromData = (parent_id, children_data) => immutable_1.List(children_data.map(node_data => createNodeFromData(parent_id, node_data)));
function createNodeFromData(parent_id, node_data) {
    function createChildren() {
        if (!node_data.children) {
            return null;
        }
        else {
            return createNodesFromData(node_data.id, node_data.children);
        }
    }
    return immutable_1.Map(node_data)
        .set("parent_id", parent_id)
        .set("children", createChildren());
}
function create(children_data) {
    function createChildren() {
        if (children_data) {
            return createNodesFromData(null, children_data);
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
    const has_children = !children.isEmpty();
    const is_root = node.get("is_root");
    const name = node.get("name");
    if (is_root) {
        if (!has_children) {
            return "";
        }
        else {
            return nodesToString(children);
        }
    }
    else if (!has_children) {
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
        if (n.get("is_root")) {
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
function treeSeqPath(is_branch, get_children, root) {
    function* walk(path, node) {
        yield [node, path.toArray()];
        if (is_branch(node)) {
            const children = get_children(node);
            const new_path = path.push(node);
            for (const child of children) {
                yield* walk(new_path, child);
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
function treeSeq(is_branch, get_children, root, include_root) {
    function* walk(node, level) {
        if (node !== root || include_root) {
            yield [node, level];
        }
        if (is_branch(node)) {
            for (const child of get_children(node)) {
                yield* walk(child, level + 1);
            }
        }
    }
    return walk(root, 0);
}
function* iterateTree(root, include_root = false) {
    for (const [node, _] of treeSeq(hasChildren, getChildren, root, include_root)) {
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
    for (const readonly_node of iterateTreeWithParents(root)) {
        if (readonly_node.node.get("name") === name) {
            const { node, parents } = readonly_node;
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
function addNode(root, readonly_parent, child_data) {
    if (child_data) {
        return addNodeToNonRoot(readonly_parent, createNode(child_data));
    }
    else {
        const data = readonly_parent;
        return addNodeToRoot(root, createNode(data));
    }
}
exports.addNode = addNode;
function addNodeToNonRoot(readonly_parent, child) {
    const parent = readonly_parent.node;
    const new_child = child.set("parent_id", parent.get("id"));
    const new_parent = addChild(parent, new_child);
    const [new_root, changed_nodes] = updateParents(parent, new_parent, readonly_parent.parents);
    return [
        new_root,
        {
            new_child,
            changed_nodes: [new_parent].concat(changed_nodes)
        }
    ];
}
function addNodeToRoot(root, child) {
    const new_root = addChild(root, child);
    return [
        new_root,
        {
            new_child: child,
            changed_nodes: []
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
function updateParents(initial_old_child, intitial_new_child, parents) {
    if (parents.length === 0) {
        throw new Error("updateParents: parents cannot be empty");
    }
    let old_child = initial_old_child;
    let new_child = intitial_new_child;
    const new_parents = parents.map(parent => {
        const new_parent = replaceChild(parent, old_child, new_child);
        old_child = parent;
        new_child = new_parent;
        return new_parent;
    });
    return [lodash_1.last(new_parents), lodash_1.dropRight(new_parents)];
}
function replaceChild(node, old_child, new_child) {
    const children = getChildren(node);
    const child_index = children.indexOf(old_child);
    const new_children = children.set(child_index, new_child);
    return node.set("children", new_children);
}
/*
  Remove node
  - return {new_root changed_nodes removed_nodes}
*/
function removeNode(readonly_child) {
    const child = readonly_child.node;
    const { parents } = readonly_child;
    const parent = lodash_1.first(parents);
    if (!parent) {
        throw new Error("removeNode: child has no parent");
    }
    if (parent.get("is_root")) {
        return removeNodeFromRoot(parent, child);
    }
    else {
        return removeNodeFromParent(parents, child);
    }
}
exports.removeNode = removeNode;
function removeNodeFromRoot(root, child) {
    const new_root = removeChild(root, child);
    const removed_nodes = Array.from(iterateTree(child, true));
    return [
        new_root,
        {
            changed_nodes: [],
            removed_nodes
        }
    ];
}
function removeNodeFromParent(parents, child) {
    const parent = lodash_1.first(parents);
    if (!parent) {
        throw new Error("removeNodeFromParent: parents cannot be empty");
    }
    const new_parent = removeChild(parent, child);
    const [new_root, changed_parents] = updateParents(parent, new_parent, lodash_1.tail(parents));
    const removed_nodes = Array.from(iterateTree(child, true));
    return [
        new_root,
        {
            changed_nodes: [new_parent].concat(changed_parents),
            removed_nodes
        }
    ];
}
function removeChild(node, child) {
    const children = getChildren(node);
    const child_index = children.indexOf(child);
    const new_children = children.delete(child_index);
    return node.set("children", new_children);
}
function updateNode(readonly_node, attributes) {
    const { node, parents } = readonly_node;
    const new_node = node.merge(attributes);
    const [new_root, changed_parents] = updateParents(node, new_node, parents);
    return [
        new_root,
        {
            changed_nodes: [new_node].concat(changed_parents)
        }
    ];
}
exports.updateNode = updateNode;
function getNextNode(readonly_node, include_children = true) {
    const { node } = readonly_node;
    if (include_children && hasChildren(node) && node.get("is_open")) {
        // First child
        return getChildren(node).first();
    }
    else {
        const next_sibling = getNextSibling(readonly_node);
        if (next_sibling) {
            // Next sibling
            return next_sibling;
        }
        else {
            const readonly_parent = getReadonlyParent(readonly_node);
            if (!readonly_parent) {
                return null;
            }
            else {
                return getNextNode(readonly_parent, false);
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
function getPreviousNode(readonly_node) {
    const previous_sibling = getPreviousSibling(readonly_node);
    if (!previous_sibling) {
        // Parent
        const parent = lodash_1.first(readonly_node.parents);
        if (!parent) {
            throw new Error("Child has no parent");
        }
        if (parent.get("is_root")) {
            return null;
        }
        else {
            return parent;
        }
    }
    else {
        if (!hasChildren(previous_sibling) ||
            !previous_sibling.get("is_open")) {
            // Previous sibling
            return previous_sibling;
        }
        else {
            // Last child of previous sibling
            return getLastChild(previous_sibling);
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
function getNextSibling(readonly_node) {
    const { node, parents } = readonly_node;
    const parent = lodash_1.first(parents);
    if (!parent) {
        return null;
    }
    else {
        const child_index = getChildIndex(parent, node);
        if (child_index === null) {
            return null;
        }
        else {
            return getChildren(parent).get(child_index + 1);
        }
    }
}
function getPreviousSibling(readonly_node) {
    const { node, parents } = readonly_node;
    const parent = lodash_1.first(parents);
    if (!parent) {
        return null;
    }
    else {
        const child_index = getChildIndex(parent, node);
        if (child_index === null || child_index === 0) {
            return null;
        }
        else {
            return getChildren(parent).get(child_index - 1);
        }
    }
}
function getLastChild(node) {
    if (!hasChildren(node)) {
        return null;
    }
    else {
        const last_child = getChildren(node).last();
        if (!hasChildren(last_child) || !last_child.get("is_open")) {
            return last_child;
        }
        else {
            return getLastChild(last_child);
        }
    }
}
//# sourceMappingURL=immutable_node.js.map