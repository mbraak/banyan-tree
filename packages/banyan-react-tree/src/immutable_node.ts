import { List, Record } from "immutable";

import { first, last, dropRight, tail } from "lodash";

export type NodeId = number|string;

export interface INodeData {
    id: NodeId;
    name: string;
    children?: INodeData[];
    load_on_demand?: boolean;
}

export interface IReadonlyNode {
    node: Node;
    parents: Node[];
}

export interface IRemoveInfo {
    changed_nodes: Node[];
    removed_nodes: Node[];
}

export interface IUpdateInfo {
    changed_nodes: Node[];
}

export interface IAddInfo {
    new_child: Node;
    changed_nodes: Node[];
}

const _Node = Record({
    id: undefined,
    name: "",
    is_root: false,
    parent_id: undefined,
    children: undefined,
    is_open: false,
    is_selected: false
});

export class Node extends _Node {
    public id: NodeId;
    public name: string;
    public is_root: boolean;
    public parent_id: any;
    public children: List<Node>;
    public is_open: boolean;
    public is_selected: boolean;
}

function createEmptyTree(): Node {
    return new Node({ is_root: true });
}

function createNodesFromData(parent_id: NodeId|null, children_data: INodeData[]): List<Node> {
    return List(
        children_data.map(
            node_data => createNodeFromData(parent_id, node_data)
        )
    );
}

function createNodeFromData(parent_id: NodeId|null, node_data: INodeData): Node {
    function createChildren() {
        if (!node_data.children) {
            return null;
        }
        else {
            return createNodesFromData(node_data.id, node_data.children);
        }
    }

    return <Node> new Node(node_data)
        .set("parent_id", parent_id)
        .set("children", createChildren());
}

export function create(children_data?: INodeData[]): Node {
    function createChildren(): List<Node> {
        if (children_data) {
            return createNodesFromData(null, children_data);
        }
        else {
            return List<Node>();
        }
    }

    return <Node> createEmptyTree()
        .set("children", createChildren());
}

function nodesToString(nodes: List<Node>): string {
    return nodes
        .map(toString)
        .join(" ");
}

export function toString(node: Node): string {
    const children = node.children ? node.children : List<Node>();
    const has_children = !children.isEmpty();

    if (node.is_root) {
        if (!has_children) {
            return "";
        }
        else {
            return nodesToString(children);
        }
    }
    else if (!has_children) {
        return node.name;
    }
    else {
        return `${node.name}(${nodesToString(children)})`;
    }
}

export function nodeListToString(nodes: Node[]): string {
    return nodes
        .map(
            n => {
                if (n.is_root) {
                    return "[root]";
                }
                else {
                    return n.name;
                }
            }
        )
        .join(" ");
}

export function hasChildren(node: Node): boolean {
    const { children } = node;

    if (!children) {
        return false;
    }
    else {
        return !children.isEmpty();
    }
}

export function getChildren(node: Node): List<Node> {
    if (node.children) {
        return node.children;
    }
    else {
        return List<Node>();
    }
}

/* Iterates over tree. Return [node parents] pairs.
  - generator
  - walks depth-first
*/
function treeSeqPath(is_branch: Function, get_children: Function, root: Node): Iterable<[Node, Node[]]> {
    function* walk(path: List<Node>, node: Node): Iterable<[Node, Node[]]> {
        yield [node, path.toArray()];

        if (is_branch(node)) {
            const children = get_children(node);
            const new_path = path.push(node);

            for (const child of children) {
                yield* walk(new_path, child);
            }
        }
    }

    return walk(List<Node>(), root);
}

// Iterate tree; return lazy sequence of readonly nodes
// - skip root
function* iterateTreeWithParents(root: Node): Iterable<IReadonlyNode> {
    for (const [node, parents] of treeSeqPath(hasChildren, getChildren, root)) {
        if (node !== root) {
            yield { node, parents };
        }
    }
}

function treeSeq(is_branch: Function, get_children: Function, root: Node): Iterable<Node> {
    function* walk(node: Node): Iterable<Node> {
        yield node;

        if (is_branch(node)) {
            const children = get_children(node);

            for (const child of children) {
                yield* walk(child);
            }
        }
    }

    return walk(root);
}

export function* iterateTree(root: Node, include_root: boolean = false): Iterable<Node> {
    if (include_root) {
        yield* treeSeq(hasChildren, getChildren, root);
    }
    else {
        for (const node of treeSeq(hasChildren, getChildren, root)) {
            if (node !== root) {
                yield node;
            }
        }
    }
}

// Find node by name; return readonly node or nil
export function getNodeByName(root: Node, name: string): IReadonlyNode|null {
    for (const readonly_node of iterateTreeWithParents(root)) {
        if (readonly_node.node.name === name) {
            const { node, parents } = readonly_node;

            return {
                node,
                parents: parents.reverse()
            };
        }
    }

    return null;
}

// Add node
//  - return [new-root {new-child changed-nodes}]
export function addNode(root: Node, readonly_parent: any, child_data?: any): [Node, IAddInfo] {
    if (child_data) {
        return addNodeToNonRoot(root, readonly_parent, new Node(child_data));
    }
    else {
        const data = <Object> readonly_parent;
        return addNodeToRoot(root, new Node(data));
    }
}

function addNodeToNonRoot(root: Node, readonly_parent: IReadonlyNode, child: Node): [Node, IAddInfo] {
    const parent = readonly_parent.node;
    const new_child = <Node> child.set("parent_id", parent.id);
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

function addNodeToRoot(root: Node, child: Node): [Node, IAddInfo] {
    const new_root = addChild(root, child);

    return [
        new_root,
        {
            new_child: child,
            changed_nodes: []
        }
    ];
}

function addChild(parent: Node, child: Node): Node {
    const children = getChildren(parent);

    return <Node> parent.set("children", children.push(child));
}

/*
  Update parent of updated-node; also update the parents of the parent

  - 'old-child' is replaced by 'new-child'
  - 'parents' are the parents of the child; direct parent first
  - returns: [new root, affected]
*/
function updateParents(initial_old_child: Node, intitial_new_child: Node, parents: Node[]): [Node, Node[]] {
    let old_child = initial_old_child;
    let new_child = intitial_new_child;

    const new_parents = parents.map(
        parent => {
            const new_parent = replaceChild(parent, old_child, new_child);

            old_child = parent;
            new_child = new_parent;

            return new_parent;
        }
    );

    return [
        last(new_parents),
        dropRight(new_parents)
    ];
}

function replaceChild(node: Node, old_child: Node, new_child: Node): Node {
    const { children } = node;
    const child_index = children.indexOf(old_child);
    const new_children = children.set(child_index, new_child);

    return <Node> node.set("children", new_children);
}

/*
  Remove node
  - return {new_root changed_nodes removed_nodes}
*/
export function removeNode(readonly_child: IReadonlyNode): [Node, IRemoveInfo] {
    const child = readonly_child.node;
    const { parents } = readonly_child;
    const parent = first(parents);

    if (parent.is_root) {
        return removeNodeFromRoot(parent, child);
    }
    else {
        return removeNodeFromParent(parents, child);
    }
}

function removeNodeFromRoot(root: Node, child: Node): [Node, IRemoveInfo] {
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

function removeNodeFromParent(parents: Node[], child: Node): [Node, IRemoveInfo] {
    const parent = first(parents);
    const new_parent = removeChild(parent, child);
    const [new_root, changed_parents] = updateParents(parent, new_parent, tail(parents));
    const removed_nodes = Array.from(iterateTree(child, true));

    return [
        new_root,
        {
            changed_nodes: [new_parent].concat(changed_parents),
            removed_nodes
        }
    ];
}

function removeChild(node: Node, child: Node): Node {
    const children = getChildren(node);
    const child_index = children.indexOf(child);
    const new_children = children.delete(child_index);

    return <Node> node.set("children", new_children);
}

export function updateNode(readonly_node: IReadonlyNode, attributes: Object): [Node, IUpdateInfo] {
    const { node, parents } = readonly_node;
    const new_node = <Node> node.merge(attributes);
    const [new_root, changed_parents] = updateParents(node, new_node, parents);

    return [
        new_root,
        {
            changed_nodes: [new_node].concat(changed_parents)
        }
    ];
}
