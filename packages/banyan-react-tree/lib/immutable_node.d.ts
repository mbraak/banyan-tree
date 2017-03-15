import { List, Record } from "immutable";
declare module "immutable" {
    interface List<T> {
        [Symbol.iterator](): IterableIterator<T>;
    }
}
export declare type NodeId = number | string;
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
export declare const _Node: Record.Class;
export declare class Node extends _Node {
    id: NodeId;
    name: string;
    is_root: boolean;
    parent_id: any;
    children: List<Node>;
    is_open: boolean;
    is_selected: boolean;
}
export declare function create(children_data?: INodeData[]): Node;
export declare function toString(node: Node): string;
export declare function nodeListToString(nodes: Node[]): string;
export declare function hasChildren(node: Node): boolean;
export declare function getChildren(node: Node): List<Node>;
export declare function iterateTree(root: Node, include_root?: boolean): Iterable<Node>;
export declare function getNodeByName(root: Node, name: string): IReadonlyNode | null;
export declare function doGetNodeByName(root: Node, name: string): IReadonlyNode;
export declare function addNode(root: Node, readonly_parent: any, child_data?: any): [Node, IAddInfo];
export declare function removeNode(readonly_child: IReadonlyNode): [Node, IRemoveInfo];
export declare function updateNode(readonly_node: IReadonlyNode, attributes: any): [Node, IUpdateInfo];
