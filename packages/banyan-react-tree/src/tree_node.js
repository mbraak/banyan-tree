/* @flow */
require("core-js");  // change import for flow

import {EventEmitter} from "events";

import xhttp from "xhttp";

import {copyProperties} from "./utils";
import {Position} from "./position";


/*
Node in a tree

- The node has properties.
- The properties "id" and "name" are required.

Creating a node:

var node = new Node(
    {
        id: 1,
        name: "abc"
    }
);

Creating a node with more properties, e.g. "height" and "color":

var node = new Node(
    {
        id: 1,
        name: "abc",
        height: 5,
        color: "blue"
    }
*/
export class Node extends EventEmitter {
    id: number;
    name: string;
    load_on_demand: bool;
    tree: Tree;
    is_selected: bool;
    is_open: bool;
    is_loading: bool;
    parent: ?Node;
    children: Array<Node>;
    properties: Object;

    /*
    Constructor

    The properties parameter must contain the keys "id" and "name"
    */
    constructor(properties: Object) {
        super();

        // todo: check required keys
        this.assignProperties(properties);

        this.children = [];
        this.parent = null;

        this.is_selected = false;
        this.is_open = false;
        this.is_loading = false;
    }

    assignProperties(properties: Object) {
        this.name = properties.name;
        this.id = properties.id;

        if (properties.load_on_demand) {
            this.load_on_demand = true;
        }
        else {
            this.load_on_demand = false;
        }

        this.properties = copyProperties(properties, ["id", "name", "children", "load_on_demand"]);
    }

    /*
    Create tree from data.

    Structure of data is:
    [
        {
            name: "node1", id: 1,
            children: [
                { name: "child1", id: 2 },
                { name: "child2", id: 3 }
            ]
        },
        {
            name: "node2",
            id: 4
        }
    ]
    */
    loadFromData(data: Array<Object>) {
        this.removeChildren();

        if (data != null) {
            var parent = this;

            data.forEach((properties) => {
                var node = new Node(properties);

                parent.addChild(node);

                if (properties.children && properties.children.length) {
                    node.loadFromData(properties.children);
                }
            });
        }
    }

    /*
    Add child.

    tree.addChild(
        new Node("child1")
    );
    */
    addChild(node: Node) {
        this.children.push(node);
        node.setParent(this);
    }

    /*
    Add child at position. Index starts at 0.

    tree.addChildAtPosition(
        new Node("abc"),
        1
    );
    */
    addChildAtPosition(node: Node, index: number) {
        this.children.splice(index, 0, node);
        node.setParent(this);
    }

    setParent(parent: Node) {
        this.parent = parent;
        this.tree = parent.tree;
        this.tree.addNodeToIndex(this);
    }

    removeChildren() {
        // remove childen from the tree index
        var tree: Tree = this.tree;

        function removeFromIndex(node) {
            tree.removeNodeFromIndex(node);
            return true;
        }

        // iterate excluding self
        this.do_iterate(removeFromIndex, false);

        // remove children from node
        this.children = [];
    }

    /*
    Remove child. This also removes the children of the node.

    tree.removeChild(tree.children[0]);
    */
    removeChild(node: Node, include_children: bool = true) {
        if (!node) {
            return;
        }

        if (include_children) {
            // remove children from the index
            node.removeChildren();
        }

        this.children.splice(
            this.getChildIndex(node),
            1
        );
        this.tree.removeNodeFromIndex(node);
    }

    /*
    Iterate over all the nodes in the tree.

    Calls callback with (node, level).

    The callback must return true to continue the iteration on current node.

    tree.iterate(
        function(node, level) {
           console.log(node.name);

           // stop iteration after level 2
           return (level <= 2);
        }
    );
    */
    iterate(on_node: Function) {
        this.do_iterate(on_node, true);
    }

    do_iterate(on_node: Function, include_self:bool = true) {
        function iterate_node(node, level, include_node) {
            function visitNode() {
                return on_node(node, level);
            }

            if ((!include_node) || visitNode()) {
                if (node.hasChildren()) {
                    node.children.forEach((child) => {
                        iterate_node(child, level + 1, true);
                    });
                }
            }
        }

        iterate_node(this, 0, include_self);
    }

    /*
    Does the node have children?

    if (node.hasChildren()) {
        //
    }
    */
    hasChildren(): bool {
        return (this.children.length !== 0);
    }

    /*
    Is the node a folder?
    */
    isFolder(): bool {
        return this.hasChildren() || this.load_on_demand;
    }

    /*
    Get child index.

    var index = getChildIndex(node);
    */
    getChildIndex(node: Node): number {
        return this.children.indexOf(node);
    }

    /*
    Is this node the parent of the parameter node?
    */
    isParentOf(node: Node): bool {
        if (!node) {
            return false;
        }
        else {
            var parent = node.parent;

            while (parent) {
                if (parent === this) {
                    return true;
                }

                parent = parent.parent;
            }

            return false;
        }
    }

    getNextNode(): ?Node {
        if (this.hasChildren() && this.is_open) {
            // First child
            return this.children[0];
        }
        else {
            return this.getNextNodeSkipChildren();
        }
    }

    getNextNodeSkipChildren(): ?Node {
        var parent = this.parent;

        if (parent == null) {
            return null;
        }
        else {
            var next_sibling = this.getNextSibling();
            if (next_sibling) {
                // Next sibling
                return next_sibling;
            }
            else {
                // Next node of parent
                return parent.getNextNodeSkipChildren();
            }
        }
    }

    getPreviousNode(): ?Node {
        var parent = this.parent;

        if (parent == null) {
            return null;
        }
        else {
            var previous_sibling = this.getPreviousSibling();
            if (previous_sibling) {
                if (!previous_sibling.hasChildren() || !previous_sibling.is_open) {
                    // Previous sibling
                    return previous_sibling;
                }
                else {
                    // Last child of previous sibling
                    return previous_sibling.getLastChild();
                }
            }
            else {
                // Parent
                if (parent.parent) {
                    return parent;
                }
                else {
                    return null;
                }
            }
        }
    }

    getPreviousSibling(): ?Node {
        var parent = this.parent;

        if (parent == null) {
            return null;
        }
        else {
            var previous_index = parent.getChildIndex(this) - 1;
            if (previous_index >= 0) {
                return parent.children[previous_index];
            }
            else {
                return null;
            }
        }
    }

    getNextSibling(): ?Node {
        var parent = this.parent;

        if (parent == null) {
            return null;
        }
        else {
            var next_index = parent.getChildIndex(this) + 1;
            if (next_index < parent.children.length) {
                return parent.children[next_index];
            }
            else {
                return null;
            }
        }
    }

    getLastChild(): ?Node {
        if (!this.hasChildren()) {
            return null;
        }
        else {
            var last_child = this.children[this.children.length - 1];
            if (!last_child.hasChildren() || !last_child.is_open) {
                return last_child;
            }
            else {
                return last_child.getLastChild();
            }
        }
    }

    open() {
        if (this.isFolder()) {
            this.is_open = true;
        }
    }

    close() {
        if (this.isFolder()) {
            this.is_open = false;
        }
    }

    select(): Array<Node> {
        return this.tree.selectNode(this);
    }

    /*
    Load node and children from this url.

    Return promise(data is loaded)
    */
    loadFromUrl(url: string): Promise {
        if (!url) {
            return Promise.resolve();
        }
        else {
            var node = this;

            node.is_loading = true;

            var promise = xhttp({url: url});

            return promise.then(
                function(tree_data) {
                    node.is_loading = false;
                    node.loadFromData(tree_data);
                }
            );
        }
    }

    /*
    Load node data on demand. The url is determined using the base url from the tree.

    Return promise(data is loaded)
    */
    loadOnDemand() {
        var base_url = this.tree.base_url;

        if (!base_url) {
            return Promise.resolve();
        }
        else {
            var promise = this.loadFromUrl(base_url + "?node=" + this.id);
            var node = this;

            promise.then(function() {
                node.load_on_demand = false;
            });

            return promise;
        }
    }

    getState(): Object {
        var getOpenAndSelectedNodes = () => {
            var open_nodes = [];
            var selected_nodes = [];

            this.iterate(
                function(node) {
                    if (node.is_open) {
                        open_nodes.push(node);
                    }

                    if (node.is_selected) {
                        selected_nodes.push(node);
                    }

                    return true;
                }
            );

            return [open_nodes, selected_nodes];
        };

        var getNodeInfo = node => {
            var parents = [];

            var parent = node.parent;
            while (parent) {
                if (parent.id) {
                    parents.push(parent.id);
                }

                parent = parent.parent;
            }

            return {
                id: node.id,
                parents: parents
            };
        };

        var [open, selected] = getOpenAndSelectedNodes();

        return {
            open: open.map(getNodeInfo),
            selected: selected.map(getNodeInfo)
        };
    }
}


export class Tree extends Node {
    id_mapping: Map;
    selected_node: ?Node;
    base_url: string;
    tree: Tree;

    constructor() {
        super({});

        this.id_mapping = new Map();
        this.tree = this;
        this.selected_node = null;
        this.base_url = "";
    }

    /*
    Select this node
    Returns changed nodes
    */
    selectNode(node: Node): Array<Node> {
        if (node === this.selected_node) {
            return [];
        }
        else {
            var changed_nodes = this.deselectCurrentNode();

            if (node != null) {
                node.is_selected = true;
                this.selected_node = node;

                changed_nodes.push(node);
            }

            this.emit("select", node);

            return changed_nodes;
        }
    }

    deselectCurrentNode(): Array<Node> {
        var selected_node = this.selected_node;

        if (selected_node == null) {
            return [];
        }
        else {
            selected_node.is_selected = false;
            this.selected_node = null;
            return [selected_node];
        }
    }

    removeNodeFromIndex(node: Node) {
        this.id_mapping.delete(node.id);
    }

    addNodeToIndex(node: Node) {
        this.id_mapping.set(node.id, node);
    }

    getNodeById(node_id: number): ?Node {
        return this.id_mapping.get(node_id);
    }

    getNodeByName(name: string): ?Node {
        var result = null;

        this.iterate(function(node) {
            if (node.name === name) {
                result = node;
                return false;
            }
            else {
                return true;
            }
        });

        return result;
    }

    iterate(on_node: Function) {
        return this.do_iterate(on_node, false);
    }

    moveDown(): Array<Node> {
        var selected_node = this.selected_node;

        if (!selected_node) {
            return [];
        }
        else {
            var node = selected_node.getNextNode();
            if (!node) {
                return [];
            }
            else {
                return this.selectNode(node);
            }
        }
    }

    moveUp(): Array<Node> {
        var selected_node = this.selected_node;

        if (!selected_node) {
            return [];
        }
        else {
            var node = selected_node.getPreviousNode();

            if (!node) {
                return [];
            }
            else {
                return this.selectNode(node);
            }
        }
    }

    /*
    Move node relative to another node.

    Argument position: Position.BEFORE, Position.AFTER or Position.Inside

    // move node1 after node2
    tree.moveNode(node1, node2, Position.AFTER);
    */
    moveNode(moved_node: Node, target_node: Node, position: number) {
        if (!(moved_node && target_node)) {
            return;
        }

        var moved_parent = moved_node.parent;
        var target_parent = target_node.parent;

        if (moved_node.isParentOf(target_node)) {
            // Node is parent of target node. This is an illegal move
            return;
        }

        if (moved_parent && target_parent) {
            moved_parent.removeChild(moved_node, false);

            if (position === Position.AFTER) {
                if (target_parent) {
                    target_parent.addChildAtPosition(
                        moved_node,
                        target_parent.getChildIndex(target_node) + 1
                    );
                }
            }
            else if (position === Position.BEFORE) {
                if (target_parent) {
                    target_parent.addChildAtPosition(
                        moved_node,
                        target_parent.getChildIndex(target_node)
                    );
                }
            }
            else if (position === Position.INSIDE) {
                // move inside as first child
                target_node.addChildAtPosition(moved_node, 0);
            }
        }
    }

    loadFromUrl(url: string) {
        this.base_url = url;

        return super.loadFromUrl(url);
    }
}
