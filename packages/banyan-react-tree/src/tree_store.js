/* @flow */
import EventEmitter from "eventemitter3";

import arrify from "arrify";

import { Tree, Node } from "./tree_node";
import { LazyIterator } from "./lazy_iterator";
import TreeController from "./tree_controller";


export class TreeStore extends EventEmitter {
    auto_open: bool|number;
    keyboard_support: bool;
    tree: Tree;
    dragging: Object;
    on_change: ?Function;
    save_state: bool;
    debug: bool;
    drag_and_drop: bool;
    on_init: ?Function;
    on_error: ?Function;
    controller: ?TreeController;

    constructor(params: Object) {
        super();

        this.auto_open = params.auto_open;
        this.keyboard_support = params.keyboard_support;
        this.save_state = params.save_state;
        this.debug = params.debug;
        this.drag_and_drop = params.drag_and_drop;

        this.on_init = params.on_init;
        this.on_error = params.on_error;
        this.on_change = null;
        this.changed_nodes = [];

        this.dragging = {};

        // create tree
        const url = params.url || "";

        const [tree, promise] = this.createTree(params.data, url);

        this.tree = tree;

        // init controller
        this.controller = params.controller;

        if (this.controller) {
            this.controller.setStore(this);
        }

        // handle init
        promise
            .then(this.initTree.bind(this))
            .then(this.fireInit.bind(this))
            .catch(this.fireError.bind(this));

        // set on_change callback
        this.on_change = params.on_change;
    }

    /*
    changed_nodes can be:
    - null; update all nodes
    - a single node; update this node (and its parents)
    - a list of nodes; update theses nodes (and their parents)
    */
    emitChange(changed_nodes: ?Array<Node>|?Node = null) {
        this.changed_nodes = arrify(changed_nodes);

        if (this.debug) {
            console.log("Emit change for node", formatNodes(this.changed_nodes));
        }

        const on_change = this.on_change;

        if (on_change) {
            on_change();
        }
    }

    handleKeyDown(key_identifier: string) {
        if (!this.keyboard_support) {
            return;
        }

        let selected_node, changed_nodes;

        switch (key_identifier) {
            case "Down":
                changed_nodes = this.tree.moveDown();
                this.emitChange(changed_nodes);
                break;

            case "Up":
                changed_nodes = this.tree.moveUp();
                this.emitChange(changed_nodes);
                break;

            case "Left":
                selected_node = this.tree.selected_node;

                if (selected_node) {
                    if (selected_node.isFolder() && selected_node.is_open) {
                        this.closeNode(selected_node);
                    }
                    else {
                        const parent_node = selected_node.getParent();

                        if (parent_node) {
                            this.selectNode(parent_node);
                        }
                    }
                }
                break;

            case "Right":
                selected_node = this.tree.selected_node;

                if (selected_node && selected_node.isFolder()) {
                    if (!selected_node.is_open) {
                        this.openNode(selected_node);
                    }
                    else {
                        const first_child = selected_node.getFirstChild();

                        if (first_child) {
                            this.selectNode(first_child);
                        }
                    }
                }
                break;
        }
    }

    toggleNode(node: Node) {
        if (node.is_open) {
            this.closeNode(node);
        }
        else {
            this.openNode(node);
        }
    }

    closeNode(node: Node) {
        if (node.isFolder() && node.is_open) {
            node.close();

            this.emitChange(node);
            this.saveState();
        }
    }

    openNode(node: Node) {
        if (node.isFolder() && !node.is_open) {
            if (!node.load_on_demand) {
                node.open();

                this.emitChange(node);
                this.saveState();
            }
            else {
                node.loadOnDemand(node)
                    .then(() => {
                        node.open();

                        this.emitChange(node);
                        this.saveState();
                    });

                this.emitChange(node);
            }
        }
    }

    selectNode(node: Node) {
        const changed_nodes = node.select();

        if (changed_nodes.length) {
            this.emitChange(changed_nodes);
            this.saveState();
        }
    }

    openAllFolders(): Promise {
        return this.openFolders(null);
    }

    openFoldersAtLevel(level: number): Promise {
        function mustContinue(node, node_level) {
            return node.isFolder() && node_level < level;
        }

        return this.openFolders(mustContinue);
    }

    startDragging(node: Node, placeholder_height: number) {
        this.dragging = {
            node,
            placeholder_height,
            hover_node: node
        };

        this.emitChange();
    }

    stopDragging() {
        this.dragging = {};

        this.emitChange();
    }

    hoverNode(node: Node) {
        if (!this.isNodeHovered(node)) {
            const changed_nodes = [node];

            if (this.dragging.hover_node) {
                changed_nodes.push(this.dragging.hover_node);
            }

            this.dragging.hover_node = node;

            this.emitChange(changed_nodes);
        }
    }

    isNodeHovered(node: Node): bool {
        const hover_node = this.dragging.hover_node;

        return (hover_node && hover_node.id === node.id);
    }

    isNodeDragged(node: Node): bool {
        const dragged_node = this.dragging.node;

        return (dragged_node && dragged_node.id === node.id);
    }

    openFolders(on_must_continue: ?Function): Promise {
        const emitChange = this.emitChange.bind(this);

        const iterator = new LazyIterator(this.tree);

        iterator.on_must_continue = on_must_continue;

        iterator.on_before_load = function(node) {
            emitChange(node);
        };

        iterator.on_visit = function(node) {
            if (node.isFolder()) {
                node.open();
                emitChange(node);
            }
        };

        return iterator.iterate()
            .then(() => {
                if (iterator.visit_count === 0) {
                    emitChange();
                }
            });
    }

    // private

    // Create tree
    // return tuple [Tree, Promise]
    createTree(data: Array<Object>, url: string): [Tree, Promise] {
        const tree = new Tree();

        let promise;

        if (data) {
            tree.loadFromData(data);
            promise = Promise.resolve();
        }
        else if (url) {
            promise = tree.loadFromUrl(url);
        }
        else {
            promise = Promise.resolve();
        }

        return [tree, promise];
    }

    // init tree
    // return Promise(is initialized)
    initTree(): Promise {
        const restore_result = this.handleRestoreState();

        if (restore_result) {
            return restore_result;
        }
        else {
            return this.handleAutoOpen();
        }
    }

    fireInit() {
        const on_init = this.on_init;

        if (on_init) {
            on_init();
        }

        this.emit("init");
    }

    fireError() {
        const on_error = this.on_error;

        if (on_error) {
            on_error();
        }
    }

    handleAutoOpen(): Promise {
        const auto_open = this.auto_open;

        if (typeof auto_open === "number") {
            return this.openFoldersAtLevel(auto_open);
        }
        else if (auto_open === true) {
            return this.openAllFolders();
        }
        else {
            return this.openFoldersAtLevel(1);
        }
    }

    getStateKey(): string {
        const save_state = this.save_state;

        if (save_state === true) {
            return "jqtree";
        }
        else if (typeof save_state === "string") {
            return save_state;
        }
        else {
            return "";
        }
    }

    handleRestoreState(): ?Promise {
        const state_key = this.getStateKey();

        if (state_key) {
            return this.loadState(state_key);
        }
        else {
            return null;
        }
    }

    loadState(state_key: string): ?Promise {
        function loadStateFromStorage(): Object|bool {
            const state_json = localStorage.getItem(state_key);

            if (!state_json) {
                return false;
            }
            else {
                const state = JSON.parse(state_json);

                if (state) {
                    return state;
                }
                else {
                    return false;
                }
            }
        }

        const tree_state = loadStateFromStorage();

        if (typeof tree_state === "object") {
            return this.restoreState(tree_state);
        }
        else {
            return null;
        }
    }

    saveState() {
        const state_key = this.getStateKey();
        if (state_key) {
            const tree_state = this.tree.getState();

            localStorage.setItem(state_key, JSON.stringify(tree_state));
        }
    }

    restoreState(tree_state: Object): Promise {
        const load_nodes_promises = {};

        // Make sure that the children of this node are loaded
        //
        // - the children are already loaded
        // or
        // - promise that the children will be loaded
        const ensureLoadChildren = node => {
            if (!node.load_on_demand) {
                // Node is already loaded
                return Promise.resolve();
            }
            else {
                // Node is loaded on demand
                if (node.is_loading) {
                    // Node is loading; return existing promise
                    return load_nodes_promises[node.id];
                }
                else {
                    // Load node; store promise
                    const promise = node.loadOnDemand();
                    this.emitChange();

                    load_nodes_promises[node.id] = promise;

                    return promise;
                }
            }
        };

        const ensureLoadNodeById = node_id => {
            const node = this.tree.getNodeById(node_id);

            if (!node) {
                // todo: this should not happen
                return Promise.resolve();
            }
            else {
                return ensureLoadChildren(node);
            }
        };

        // Ensure that nodes in this tree are loaded
        // Tree is defined by node_ids = [root, child of root, .., child]
        const ensureLoadTree = node_ids =>
            ensureLoadNodeById(node_ids[0])
                .then(() => {
                    node_ids.shift();

                    if (node_ids.length === 0) {
                        return Promise.resolve();
                    }
                    else {
                        return ensureLoadTree(node_ids);
                    }
                });

        const openNode = node_info => {
            const node_id = node_info.id;
            const parent_ids = node_info.parents;

            // [node, parent, parent of parent, ..., root]
            const node_ids = [node_id].concat(parent_ids).reverse();

            return ensureLoadTree(node_ids).then(() => {
                const node = this.tree.getNodeById(node_id);

                if (node) {
                    node.open();
                    this.emitChange(node);
                }

                return Promise.resolve();
            });
        };

        const selectNode = node_info => {
            const node_id = node_info.id;
            const parent_ids = node_info.parents;

            const node_ids = parent_ids.reverse();

            return ensureLoadTree(node_ids).then(() => {
                const node = this.tree.getNodeById(node_id);

                if (node) {
                    node.select();
                    this.emitChange(node);
                }
            });
        };

        const openNodes = () =>
            Promise.all(
                tree_state.open.map(openNode)
            );

        const selectNodes = () =>
            Promise.all(
                tree_state.selected.map(selectNode)
            );

        if (!tree_state.open.length && !tree_state.selected.length) {
            this.emitChange();
            return Promise.resolve();
        }
        else {
            return openNodes().then(selectNodes);
        }
    }

    isNodeChanged(node: Node): bool {
        if (!this.changed_nodes.length) {
            return true;
        }
        else {
            return this.changed_nodes.some(
                changed_node => changed_node.id === node.id || node.isParentOf(changed_node)
            );
        }
    }
}

function formatNodes(nodes) {
    if (!nodes) {
        return "";
    }
    else {
        const names = [];
        nodes.forEach((n) => {
            names.push(n.name);
        });
        return names.join(" ");
    }
}
