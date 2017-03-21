import { expect } from "chai";
import { range } from "lodash";
import TreeModel, { Node as ModelNode } from "tree-model";

import { Tree } from "../immutable_tree";
import { INodeData, NodeId, Node } from "../immutable_node";
import { newId, randomString, randomNodeIdOrNull, randomNodeId, pickWeightedRandom } from "../testutil/test_util";

interface ITreeImplementation<T> {
    createTree: () => T;

    addNode: (tree: T, parent_id: NodeId|null, node_data: INodeData) => T;

    removeNode: (tree: T, node_id: NodeId|null) => T;

    updateNode: (tree: T, node_id: NodeId|null, name: string) => T;

    toString: (tree: T) => string;
}

class ImmutableTreeImplementation implements ITreeImplementation<Tree> {
    public createTree(): Tree {
        return new Tree();
    }

    public addNode(tree: Tree, parent_id: NodeId|null, node_data: INodeData): Tree {
        if (!parent_id) {
            return tree.addNode(node_data);
        }
        else {
            const parent = this.getNodeById(tree, parent_id);

            return tree.addNode(parent, node_data);
        }
    }

    public removeNode(tree: Tree, node_id: NodeId|null): Tree {
        if (!node_id) {
            return tree;
        }
        else {
            const node = this.getNodeById(tree, node_id);

            return tree.removeNode(node);
        }
    }

    public updateNode(tree: Tree, node_id: NodeId|null, name: string): Tree {
        if (!node_id) {
            return tree;
        }
        else {
            const node = this.getNodeById(tree, node_id);

            return tree.updateNode(node, { name });
        }
    }

    public toString(tree: Tree): string {
        return tree.toString();
    }

    private getNodeById(tree: Tree, node_id: NodeId): Node {
        const node = tree.getNodeById(node_id);

        if (!node) {
            throw new Error(`ImmutableTreeImplementation: node with id '${node_id} not found`);
        }

        return node;
    }
}

class TreeModelImplementation implements ITreeImplementation<ModelNode> {
    public createTree(): ModelNode {
        return new TreeModel().parse({});
    }

    public addNode(tree: ModelNode, parent_id: NodeId|null, node_data: INodeData): ModelNode {
        const child = new TreeModel().parse(node_data);

        if (!parent_id) {
            tree.addChild(child);
        }
        else {
            const parent = this.getNodeById(tree, parent_id);

            parent.addChild(child);
        }

        return tree;
    }

    public removeNode(tree: ModelNode, node_id: NodeId|null): ModelNode {
        if (!node_id) {
            return tree;
        }
        else {
            const node = this.getNodeById(tree, node_id);

            node.drop();

            return tree;
        }
    }

    public updateNode(tree: ModelNode, node_id: NodeId|null, name: string): ModelNode {
        if (!node_id) {
            return tree;
        }
        else {
            const node = this.getNodeById(tree, node_id);

            node.model.name = name;

            return tree;
        }
    }

    public toString(tree: ModelNode) {
        return modelNodeToString(tree);
    }

    private getNodeById(tree: ModelNode, node_id: NodeId) {
        const node = tree.first(n => n.model.id === node_id);

        if (!node) {
            throw new Error(`TreeModelImplementation: node with id '${node_id} not found`);
        }

        return node;
    }
}

const modelNodeToString = (node: ModelNode): string => {
    if (node.isRoot()) {
        if (!node.hasChildren()) {
            return "";
        }
        else {
            return modelNodesToString(node.children);
        }
    }
    else if (!node.hasChildren()) {
        return node.model.name;
    }
    else {
        return `${node.model.name}(${modelNodesToString(node.children)})`;
    }
};

const modelNodesToString = (nodes: ModelNode[]): string => (
    nodes
        .map(modelNodeToString)
        .join(" ")
);

const getAddNodeParams = (tree: Tree): [NodeId|null, INodeData] => (
    [
        randomNodeIdOrNull(tree),
        { id: newId(), name: randomString() },
    ]
);

const getRemoveNodeParams = (tree: Tree): [NodeId|null] => (
    [ randomNodeId(tree) ]
);

const getUpdateNodeParams = (tree: Tree): [NodeId|null, string] => (
    [
        randomNodeId(tree),
        randomString()
    ]
);

const implementations = [
    new ImmutableTreeImplementation(),
    new TreeModelImplementation()
];

const param_creators: any = {
    addNode: getAddNodeParams,
    removeNode: getRemoveNodeParams,
    updateNode: getUpdateNodeParams
};

const operation_weights = {
    addNode: 60,
    removeNode: 20,
    updateNode: 20
};

describe("Tree.property", () => {
    it("test properties", () => {
        range(10).forEach(
            () => {
                let trees = implementations.map(
                    implementation => implementation.createTree()
                );

                range(200).forEach(
                    () => {
                        // pick operation and params
                        const operation = pickWeightedRandom(operation_weights);
                        const createParams = param_creators[operation];
                        const params = createParams(trees[0]);

                        // run operation
                        trees = trees.map(
                            (tree, i) => (implementations[i] as any)[operation](tree, ...params)
                        );

                        // compare trees
                        const tree_strings = trees.map(
                            (tree, i) => (implementations[i] as any).toString(tree)
                        );

                        const first_string = tree_strings[0];

                        tree_strings.forEach(
                            s => {
                                expect(s).to.eq(first_string);
                            }
                        );
                    }
                );
            }
        );
    });
});
