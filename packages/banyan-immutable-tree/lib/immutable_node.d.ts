import { List, Map } from "immutable";
export declare type Node = Map<string, any>;
export declare type NodeId = number | string;
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
export declare function create(childrenData?: INodeData[]): Node;
export declare function toString(node?: Node): string;
export declare function nodeListToString(nodes: Node[]): string;
export declare function hasChildren(node: Node): boolean;
export declare function getChildren(node: Node): List<Node>;
export declare function iterateTree(root: Node, includeRoot?: boolean): Iterable<Node>;
export declare function iterateTreeAndLevel(root: Node): Iterable<[Node, number]>;
export declare function getNodeByName(root: Node, name: string): IReadonlyNode | null;
export declare function doGetNodeByName(root: Node, name: string): IReadonlyNode;
export declare function addNode(root: Node, readonlyParent: any, childData?: any): [Node, IAddInfo];
export declare function removeNode(readonlyChild: IReadonlyNode): [Node, IRemoveInfo];
export declare function updateNode(readonlyNode: IReadonlyNode, attributes: any): [Node, IUpdateInfo];
export declare function getNextNode(readonlyNode: IReadonlyNode, includeChildren?: boolean): Node | undefined;
export declare function getPreviousNode(readonlyNode: IReadonlyNode): Node | undefined;
//# sourceMappingURL=immutable_node.d.ts.map