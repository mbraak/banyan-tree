import { List, Map } from "immutable";
declare module "immutable" {
    interface List<T> {
        [Symbol.iterator](): IterableIterator<T>;
    }
}
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
export declare function create(children_data?: INodeData[]): Node;
export declare function toString(node?: Node): string;
export declare function nodeListToString(nodes: Node[]): string;
export declare function hasChildren(node: Node): boolean;
export declare function getChildren(node: Node): List<Node>;
export declare function iterateTree(root: Node, include_root?: boolean): Iterable<Node>;
export declare function iterateTreeAndLevel(root: Node): Iterable<[Node, number]>;
export declare function getNodeByName(root: Node, name: string): IReadonlyNode | null;
export declare function doGetNodeByName(root: Node, name: string): IReadonlyNode;
export declare function addNode(root: Node, readonly_parent: any, child_data?: any): [Node, IAddInfo];
export declare function removeNode(readonly_child: IReadonlyNode): [Node, IRemoveInfo];
export declare function updateNode(readonly_node: IReadonlyNode, attributes: any): [Node, IUpdateInfo];
export declare function getNextNode(readonly_node: IReadonlyNode, include_children?: boolean): Node | null;
export declare function getPreviousNode(readonly_node: IReadonlyNode): Node | null;
