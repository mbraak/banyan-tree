import { List, Map } from "immutable";

import * as node from "./immutable_node";
import { Node, NodeId, INodeData, IReadonlyNode } from "./immutable_node";

export class Tree {
    public root: Node;
    private ids: Map<NodeId, Node>;
    private selected: NodeId | null;

    constructor(data: INodeData[] = []) {
        this.root = node.create(data);
        this.ids = createIdMap(this.root);

        this.selected = null;
    }

    public toString(): string {
        return node.toString(this.root);
    }

    public getChildren(): List<Node> {
        return node.getChildren(this.root);
    }

    public hasChildren(): boolean {
        return node.hasChildren(this.root);
    }

    public addNode(child: INodeData, parent?: Node): Tree {
        if (!parent) {
            return this.addNodeToRoot(child);
        } else {
            return this.addNodeToParent(parent, child);
        }
    }

    public getNodeByName(name: string): Node | null {
        const foundNode = node.getNodeByName(this.root, name);

        if (!foundNode) {
            return null;
        } else {
            return foundNode.node;
        }
    }

    public doGetNodeByName(name: string): Node {
        return node.doGetNodeByName(this.root, name).node;
    }

    public removeNode(n: Node): Tree {
        const [newRoot, affectedInfo] = node.removeNode(
            this.getReadonlyNode(n)
        );

        return this.updateTree(
            newRoot,
            affectedInfo.changedNodes,
            affectedInfo.removedNodes.map(removedNode => removedNode.get("id"))
        );
    }

    public getNodeById(id: NodeId): Node | undefined {
        return this.ids.get(id);
    }

    public doGetNodeById(id: NodeId): Node {
        const result = this.getNodeById(id);

        if (!result) {
            throw Error(`Node with id '${id} not found`);
        }

        return result;
    }

    public openNode(id: NodeId): Tree {
        const n = this.getNodeById(id);

        if (!n) {
            return this;
        } else {
            return this.updateNode(n, { isOpen: true });
        }
    }

    public closeNode(id: NodeId): Tree {
        const n = this.getNodeById(id);

        if (!n) {
            return this;
        } else {
            return this.updateNode(n, { isOpen: false });
        }
    }

    public isNodeOpen(id: NodeId): boolean {
        const n = this.getNodeById(id);

        if (!n) {
            return false;
        } else {
            return Boolean(n.get("isOpen"));
        }
    }

    public selectNode(id: NodeId): Tree {
        const t = this.deselect();
        const n = t.getNodeById(id);

        if (!n) {
            return t;
        } else {
            const newTree = t.updateNode(n, { isSelected: true });
            newTree.selected = id;
            return newTree;
        }
    }

    public toggleNode(id: NodeId): Tree {
        if (this.isNodeOpen(id)) {
            return this.closeNode(id);
        } else {
            return this.openNode(id);
        }
    }

    public updateNode(n: Node, attributes: any): Tree {
        const [newRoot, updateInfo] = node.updateNode(
            this.getReadonlyNode(n),
            attributes
        );

        return this.updateTree(newRoot, updateInfo.changedNodes, []);
    }

    public openAllFolders(): Tree {
        let tree: Tree = this;

        for (const n of node.iterateTree(this.root)) {
            tree = tree.openNode(n.get("id"));
        }

        return tree;
    }

    public openLevel(level: number): Tree {
        let tree: Tree = this;

        for (const [n, nodeLevel] of node.iterateTreeAndLevel(this.root)) {
            if (nodeLevel <= level) {
                tree = tree.openNode(n.get("id"));
            }
        }

        return tree;
    }

    public getSelectedNode(): Node | undefined {
        if (!this.selected) {
            return undefined;
        } else {
            return this.getNodeById(this.selected);
        }
    }

    public getIds(): NodeId[] {
        return this.ids.keySeq().toArray();
    }

    public getNodes(): Node[] {
        return this.ids.valueSeq().toArray();
    }

    /*
        Change selected node based on key code.

        Returns [ isHandled, newTree ]

        ```
        const [ isHandled, newTree ] = tree.handleKey("ArrowDown");
        ```
    */
    public handleKey(key: string): [boolean, Tree] {
        const selectedNode = this.getSelectedNode();

        if (!selectedNode) {
            return [false, this];
        } else {
            const selectNode = (n: Node | undefined) =>
                n ? this.selectNode(n.get("id")) : this;

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
                    } else {
                        const isOpen = selectedNode.get("isOpen");

                        if (isOpen) {
                            // Right moves to the first child of an open node
                            return [
                                true,
                                selectNode(this.getNextNode(selectedNode))
                            ];
                        } else {
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
                    } else {
                        // Left on a closed or end node moves focus to the node's parent
                        const parentId = selectedNode.get("parentId");

                        if (parentId === null) {
                            return [false, this];
                        } else {
                            return [true, this.selectNode(parentId)];
                        }
                    }

                default:
                    return [false, this];
            }
        }
    }

    public getNextNode(n: Node): Node | undefined {
        return node.getNextNode(this.getReadonlyNode(n));
    }

    public getPreviousNode(n: Node): Node | undefined {
        return node.getPreviousNode(this.getReadonlyNode(n));
    }

    private addNodeToRoot(child: INodeData): Tree {
        const [newRoot, updateInfo] = node.addNode(this.root, child);

        return this.updateTree(newRoot, [updateInfo.newChild], []);
    }

    private addNodeToParent(parent: Node, child: INodeData): Tree {
        const readonlyParent = this.getReadonlyNode(parent);
        const [newRoot, updateInfo] = node.addNode(
            this.root,
            readonlyParent,
            child
        );

        return this.updateTree(
            newRoot,
            updateInfo.changedNodes.concat([updateInfo.newChild]),
            []
        );
    }

    private getReadonlyNode(n: Node): IReadonlyNode {
        return {
            node: n,
            parents: this.getParents(n)
        };
    }

    private getParents(n: Node): Node[] {
        if (n.get("is_root")) {
            return [];
        } else {
            const parents: Node[] = [];
            let currentNode: Node | undefined = n;

            while (currentNode && currentNode.get("parentId")) {
                const parent: Node | undefined = this.getNodeById(
                    currentNode.get("parentId")
                );

                if (parent) {
                    parents.push(parent);
                }

                currentNode = parent;
            }

            parents.push(this.root);

            return parents;
        }
    }

    private updateTree(
        newRoot: Node,
        updatedNodes: Node[],
        deletedIds: NodeId[]
    ): Tree {
        const newIds = this.updateIds(updatedNodes, deletedIds);

        const newTree = this.createCopy();

        newTree.ids = newIds;
        newTree.root = newRoot;

        return newTree;
    }

    private createCopy(): Tree {
        const newTree = new Tree();

        newTree.ids = this.ids;
        newTree.root = this.root;
        newTree.selected = this.selected;

        return newTree;
    }

    private updateIds(
        updatedNodes: Node[],
        deletedIds: NodeId[]
    ): Map<NodeId, Node> {
        const tuples = updatedNodes.map(
            (n: Node) => [n.get("id") as NodeId, n] as [number, Node]
        );

        const updatedNodeMap = Map<NodeId, Node>(tuples);

        let newIds = this.ids.merge(updatedNodeMap);

        deletedIds.forEach(id => {
            newIds = newIds.delete(id);
        });

        return newIds;
    }

    private deselect(): Tree {
        if (!this.selected) {
            return this;
        } else {
            const n = this.getNodeById(this.selected);

            if (!n) {
                return this;
            } else {
                const newTree = this.updateNode(n, { is_selected: false });
                newTree.selected = null;

                return newTree;
            }
        }
    }
}

function createIdMap(root: Node): Map<NodeId, Node> {
    function* iteratePairs() {
        for (const n of node.iterateTree(root)) {
            yield [n.get("id"), n] as [NodeId, Node];
        }
    }

    return Map<NodeId, Node>(iteratePairs());
}
