import { List, Map } from "immutable";

import { first, last, dropRight, tail } from "lodash";

declare module "immutable" {
    // tslint:disable-next-line: interface-name
    interface List<T> {
        [Symbol.iterator](): IterableIterator<T>;
    }
}

export type Node = Map<string, any>;

type GetChildren = (node: Node) => List<Node>;
type IsBranch = (node: Node) => boolean;

export type NodeId = number|string;

export interface INodeData {
    id: NodeId;
    name: string;
    children?: INodeData[];
    [key: string]: any;
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

const createEmptyTree = (): Node => createNode({ is_root: true });

const createNode = (data: any) => Map<string, any>(data) as any as Node;

const createNodesFromData = (parent_id: NodeId|null, children_data: INodeData[]): List<Node> => (
    List(
        children_data.map(
            node_data => createNodeFromData(parent_id, node_data)
        )
    )
);

function createNodeFromData(parent_id: NodeId|null, node_data: INodeData): Node {
    function createChildren() {
        if (!node_data.children) {
            return null;
        }
        else {
            return createNodesFromData(node_data.id, node_data.children);
        }
    }

    return Map<string, any>(node_data)
        .set("parent_id", parent_id)
        .set("children", createChildren()) as any as Node;
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

    return createEmptyTree()
        .set("children", createChildren()) as Node;
}

function nodesToString(nodes: List<Node>): string {
    return nodes
        .map(toString)
        .join(" ");
}

export function toString(node: Node): string {
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

export function nodeListToString(nodes: Node[]): string {
    return nodes
        .map(
            n => {
                if (n.get("is_root")) {
                    return "[root]";
                }
                else {
                    return n.get("name");
                }
            }
        )
        .join(" ");
}

export function hasChildren(node: Node): boolean {
    const children = node.get("children");

    if (!children) {
        return false;
    }
    else {
        return !children.isEmpty();
    }
}

export function getChildren(node: Node): List<Node> {
    const children = node.get("children");

    if (children) {
        return children;
    }
    else {
        return List<Node>();
    }
}

/* Iterates over tree. Return [node parents] pairs.
  - generator
  - walks depth-first
*/
function treeSeqPath(
    is_branch: IsBranch, get_children: GetChildren, root: Node
): Iterable<[Node, Node[]]> {
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

function treeSeq(
    is_branch: IsBranch, get_children: GetChildren, root: Node, include_root: boolean
): Iterable<[Node, number]> {
    function* walk(node: Node, level: number): Iterable<[Node, number]> {
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

export function* iterateTree(root: Node, include_root: boolean = false): Iterable<Node> {
    for (const [node, _] of treeSeq(hasChildren, getChildren, root, include_root)) {
        yield node;
    }
}

export function* iterateTreeAndLevel(root: Node): Iterable<[Node, number]> {
    yield* treeSeq(hasChildren, getChildren, root, false);
}

// Find node by name; return readonly node or nil
export function getNodeByName(root: Node, name: string): IReadonlyNode|null {
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

export function doGetNodeByName(root: Node, name: string): IReadonlyNode {
    const result = getNodeByName(root, name);

    if (!result) {
        throw Error(`Node ${name} not found`);
    }

    return result;
}

// Add node
//  - return [new-root {new-child changed-nodes}]
export function addNode(root: Node, readonly_parent: any, child_data?: any): [Node, IAddInfo] {
    if (child_data) {
        return addNodeToNonRoot(readonly_parent, createNode(child_data));
    }
    else {
        const data = readonly_parent;
        return addNodeToRoot(root, createNode(data));
    }
}

function addNodeToNonRoot(readonly_parent: IReadonlyNode, child: Node): [Node, IAddInfo] {
    const parent = readonly_parent.node;
    const new_child = child.set("parent_id", parent.get("id")) as Node;
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

    return parent.set("children", children.push(child)) as Node;
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
    const children = getChildren(node);
    const child_index = children.indexOf(old_child);
    const new_children = children.set(child_index, new_child);

    return node.set("children", new_children) as Node;
}

/*
  Remove node
  - return {new_root changed_nodes removed_nodes}
*/
export function removeNode(readonly_child: IReadonlyNode): [Node, IRemoveInfo] {
    const child = readonly_child.node;
    const { parents } = readonly_child;
    const parent = first(parents);

    if (parent.get("is_root")) {
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

    return node.set("children", new_children) as Node;
}

export function updateNode(readonly_node: IReadonlyNode, attributes: any): [Node, IUpdateInfo] {
    const { node, parents } = readonly_node;
    const new_node = node.merge(attributes) as Node;
    const [new_root, changed_parents] = updateParents(node, new_node, parents);

    return [
        new_root,
        {
            changed_nodes: [new_node].concat(changed_parents)
        }
    ];
}

export function getNextNode(readonly_node: IReadonlyNode, include_children = true): Node|null {
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

function getReadonlyParent(node: IReadonlyNode): IReadonlyNode|null {
    const { parents } = node;
    const parent = first(parents);

    if (!parent) {
        return null;
    }
    else {
        return {
            node: parent,
            parents: tail(parents)
        };
    }
}

export function getPreviousNode(readonly_node: IReadonlyNode): Node|null {
    const previous_sibling = getPreviousSibling(readonly_node);

    if (!previous_sibling) {
        // Parent
        return first(readonly_node.parents);
    }
    else {
        if (!hasChildren(previous_sibling) || !previous_sibling.get("is_open")) {
            // Previous sibling
            return previous_sibling;
        }
        else {
            // Last child of previous sibling
            return getChildren(previous_sibling).last();
        }
    }
}

function getChildIndex(parent: Node, child: Node): number|null {
    const index = getChildren(parent).indexOf(child);

    if (index === -1) {
        return null;
    }
    else {
        return index;
    }
}

function getNextSibling(readonly_node: IReadonlyNode): Node|null {
    const { node, parents } = readonly_node;
    const parent = first(parents);

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

function getPreviousSibling(readonly_node: IReadonlyNode): Node|null {
    const { node, parents } = readonly_node;
    const parent = first(parents);

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
