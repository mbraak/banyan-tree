import { List, Map } from "immutable";

import { first, last, dropRight, tail } from "lodash";

export type Node = Map<string, any>;

type GetChildren = (node: Node) => List<Node>;
type IsBranch = (node: Node) => boolean;

export type NodeId = number | string;

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
    changedNodes: Node[];
    removedNodes: Node[];
}

export interface IUpdateInfo {
    changedNodes: Node[];
}

export interface IAddInfo {
    newChild: Node;
    changedNodes: Node[];
}

const createEmptyTree = (): Node => createNode({ isRoot: true });

const createNode = (data: any) => (Map<string, any>(data) as any) as Node;

const createNodesFromData = (
    parentId: NodeId | null,
    childrenData: INodeData[]
): List<Node> =>
    List(childrenData.map(nodeData => createNodeFromData(parentId, nodeData)));

function createNodeFromData(
    parentId: NodeId | null,
    nodeData: INodeData
): Node {
    function createChildren() {
        if (!nodeData.children) {
            return null;
        } else {
            return createNodesFromData(nodeData.id, nodeData.children);
        }
    }

    return (Map<any>(nodeData)
        .set("parentId", parentId)
        .set("children", createChildren()) as any) as Node;
}

export function create(childrenData?: INodeData[]): Node {
    function createChildren(): List<Node> {
        if (childrenData) {
            return createNodesFromData(null, childrenData);
        } else {
            return List<Node>();
        }
    }

    return createEmptyTree().set("children", createChildren()) as Node;
}

function nodesToString(nodes: List<Node>): string {
    return nodes.map(toString).join(" ");
}

export function toString(node?: Node): string {
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
        } else {
            return nodesToString(children);
        }
    } else if (!hasChildren) {
        return name;
    } else {
        return `${name}(${nodesToString(children)})`;
    }
}

export function nodeListToString(nodes: Node[]): string {
    return nodes
        .map(n => {
            if (n.get("isRoot")) {
                return "[root]";
            } else {
                return n.get("name");
            }
        })
        .join(" ");
}

export function hasChildren(node: Node): boolean {
    const children = node.get("children");

    if (!children) {
        return false;
    } else {
        return !children.isEmpty();
    }
}

export function getChildren(node: Node): List<Node> {
    const children = node.get("children");

    if (children) {
        return children;
    } else {
        return List<Node>();
    }
}

/* Iterates over tree. Return [node parents] pairs.
  - generator
  - walks depth-first
*/
function treeSeqPath(
    isBranch: IsBranch,
    getChildren: GetChildren,
    root: Node
): Iterable<[Node, Node[]]> {
    function* walk(path: List<Node>, node: Node): Iterable<[Node, Node[]]> {
        yield [node, path.toArray()];

        if (isBranch(node)) {
            const children = getChildren(node);
            const newPath = path.push(node);

            for (const child of children) {
                yield* walk(newPath, child);
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
    isBranch: IsBranch,
    getChildren: GetChildren,
    root: Node,
    includeRoot: boolean
): Iterable<[Node, number]> {
    function* walk(node: Node, level: number): Iterable<[Node, number]> {
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

export function* iterateTree(
    root: Node,
    includeRoot: boolean = false
): Iterable<Node> {
    for (const [node] of treeSeq(hasChildren, getChildren, root, includeRoot)) {
        yield node;
    }
}

export function* iterateTreeAndLevel(root: Node): Iterable<[Node, number]> {
    yield* treeSeq(hasChildren, getChildren, root, false);
}

// Find node by name; return readonly node or nil
export function getNodeByName(root: Node, name: string): IReadonlyNode | null {
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

export function doGetNodeByName(root: Node, name: string): IReadonlyNode {
    const result = getNodeByName(root, name);

    if (!result) {
        throw Error(`Node ${name} not found`);
    }

    return result;
}

// Add node
//  - return [new-root {new-child changed-nodes}]
export function addNode(
    root: Node,
    readonlyParent: any,
    childData?: any
): [Node, IAddInfo] {
    if (childData) {
        return addNodeToNonRoot(readonlyParent, createNode(childData));
    } else {
        const data = readonlyParent;
        return addNodeToRoot(root, createNode(data));
    }
}

function addNodeToNonRoot(
    readonlyParent: IReadonlyNode,
    child: Node
): [Node, IAddInfo] {
    const parent = readonlyParent.node;
    const newChild = child.set("parentId", parent.get("id")) as Node;
    const newParent = addChild(parent, newChild);
    const [new_root, changedNodes] = updateParents(
        parent,
        newParent,
        readonlyParent.parents
    );

    return [
        new_root,
        {
            newChild,
            changedNodes: [newParent].concat(changedNodes)
        }
    ];
}

function addNodeToRoot(root: Node, child: Node): [Node, IAddInfo] {
    const newRoot = addChild(root, child);

    return [
        newRoot,
        {
            newChild: child,
            changedNodes: []
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
function updateParents(
    initialOldChild: Node,
    intitialNewChild: Node,
    parents: Node[]
): [Node, Node[]] {
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

    return [last(newParents) as Node, dropRight(newParents) as Node[]];
}

function replaceChild(node: Node, oldChild: Node, newChild: Node): Node {
    const children = getChildren(node);
    const childIndex = children.indexOf(oldChild);
    const newChildren = children.set(childIndex, newChild);

    return node.set("children", newChildren) as Node;
}

/*
  Remove node
  - return {new_root changed_nodes removed_nodes}
*/
export function removeNode(readonlyChild: IReadonlyNode): [Node, IRemoveInfo] {
    const child = readonlyChild.node;
    const { parents } = readonlyChild;
    const parent = first(parents);

    if (!parent) {
        throw new Error("removeNode: child has no parent");
    }

    if (parent.get("isRoot")) {
        return removeNodeFromRoot(parent, child);
    } else {
        return removeNodeFromParent(parents, child);
    }
}

function removeNodeFromRoot(root: Node, child: Node): [Node, IRemoveInfo] {
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

function removeNodeFromParent(
    parents: Node[],
    child: Node
): [Node, IRemoveInfo] {
    const parent = first(parents);

    if (!parent) {
        throw new Error("removeNodeFromParent: parents cannot be empty");
    }

    const newParent = removeChild(parent, child);
    const [newRoot, changedParents] = updateParents(
        parent,
        newParent,
        tail(parents)
    );
    const removedNodes = Array.from(iterateTree(child, true));

    return [
        newRoot,
        {
            changedNodes: [newParent].concat(changedParents),
            removedNodes
        }
    ];
}

function removeChild(node: Node, child: Node): Node {
    const children = getChildren(node);
    const childIndex = children.indexOf(child);
    const newChildren = children.delete(childIndex);

    return node.set("children", newChildren) as Node;
}

export function updateNode(
    readonlyNode: IReadonlyNode,
    attributes: any
): [Node, IUpdateInfo] {
    const { node, parents } = readonlyNode;
    const newNode = node.merge(attributes) as Node;
    const [newRoot, changedParents] = updateParents(node, newNode, parents);

    return [
        newRoot,
        {
            changedNodes: [newNode].concat(changedParents)
        }
    ];
}

export function getNextNode(
    readonlyNode: IReadonlyNode,
    includeChildren = true
): Node | undefined {
    const { node } = readonlyNode;

    if (includeChildren && hasChildren(node) && node.get("isOpen")) {
        // First child
        return getChildren(node).first();
    } else {
        const nextSibling = getNextSibling(readonlyNode);

        if (nextSibling) {
            // Next sibling
            return nextSibling;
        } else {
            const readonlyParent = getReadonlyParent(readonlyNode);

            if (!readonlyParent) {
                return undefined;
            } else {
                return getNextNode(readonlyParent, false);
            }
        }
    }
}

function getReadonlyParent(node: IReadonlyNode): IReadonlyNode | null {
    const { parents } = node;
    const parent = first(parents);

    if (!parent) {
        return null;
    } else {
        return {
            node: parent,
            parents: tail(parents)
        };
    }
}

export function getPreviousNode(readonlyNode: IReadonlyNode): Node | undefined {
    const previousSibling = getPreviousSibling(readonlyNode);

    if (!previousSibling) {
        // Parent
        const parent = first(readonlyNode.parents);

        if (!parent) {
            throw new Error("Child has no parent");
        }

        if (parent.get("isRoot")) {
            return undefined;
        } else {
            return parent;
        }
    } else {
        if (!hasChildren(previousSibling) || !previousSibling.get("isOpen")) {
            // Previous sibling
            return previousSibling;
        } else {
            // Last child of previous sibling
            return getLastChild(previousSibling);
        }
    }
}

function getChildIndex(parent: Node, child: Node): number | null {
    const index = getChildren(parent).indexOf(child);

    if (index === -1) {
        return null;
    } else {
        return index;
    }
}

function getNextSibling(readonlyNode: IReadonlyNode): Node | undefined {
    const { node, parents } = readonlyNode;
    const parent = first(parents);

    if (!parent) {
        return undefined;
    } else {
        const childIndex = getChildIndex(parent, node);

        if (childIndex === null) {
            return undefined;
        } else {
            return getChildren(parent).get(childIndex + 1);
        }
    }
}

function getPreviousSibling(readonlyNode: IReadonlyNode): Node | undefined {
    const { node, parents } = readonlyNode;
    const parent = first(parents);

    if (!parent) {
        return undefined;
    } else {
        const childIndex = getChildIndex(parent, node);

        if (childIndex === null || childIndex === 0) {
            return undefined;
        } else {
            return getChildren(parent).get(childIndex - 1);
        }
    }
}

function getLastChild(node: Node): Node | undefined {
    if (!hasChildren(node)) {
        return undefined;
    } else {
        const lastChild = getChildren(node).last(undefined);

        if (!lastChild) {
            return undefined;
        }

        if (!hasChildren(lastChild) || !lastChild.get("isOpen")) {
            return lastChild;
        } else {
            return getLastChild(lastChild);
        }
    }
}
