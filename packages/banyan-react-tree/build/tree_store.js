"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
    value: true
});
/* @flow */

var _EventEmitter2 = require("eventemitter3");

var _EventEmitter3 = _interopRequireWildcard(_EventEmitter2);

var _Tree$Node = require("./tree_node");

var _LazyIterator = require("./lazy_iterator");

var _toArray = require("./utils");

var _TreeController = require("./tree_controller");

var _TreeController2 = _interopRequireWildcard(_TreeController);

var TreeStore = (function (_EventEmitter) {
    function TreeStore(params) {
        _classCallCheck(this, TreeStore);

        _get(Object.getPrototypeOf(TreeStore.prototype), "constructor", this).call(this);

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
        var url = params.url || "";

        var _createTree = this.createTree(params.data, url);

        var _createTree2 = _slicedToArray(_createTree, 2);

        var tree = _createTree2[0];
        var promise = _createTree2[1];

        this.tree = tree;

        // init controller
        this.controller = params.controller;

        if (this.controller) {
            this.controller.setStore(this);
        }

        // handle init
        promise.then(this.initTree.bind(this)).then(this.fireInit.bind(this))["catch"](this.fireError.bind(this));

        // set on_change callback
        this.on_change = params.on_change;
    }

    _inherits(TreeStore, _EventEmitter);

    _createClass(TreeStore, [{
        key: "auto_open",
        value: undefined,
        enumerable: true
    }, {
        key: "keyboard_support",
        value: undefined,
        enumerable: true
    }, {
        key: "tree",
        value: undefined,
        enumerable: true
    }, {
        key: "dragging",
        value: undefined,
        enumerable: true
    }, {
        key: "on_change",
        value: undefined,
        enumerable: true
    }, {
        key: "save_state",
        value: undefined,
        enumerable: true
    }, {
        key: "debug",
        value: undefined,
        enumerable: true
    }, {
        key: "drag_and_drop",
        value: undefined,
        enumerable: true
    }, {
        key: "on_init",
        value: undefined,
        enumerable: true
    }, {
        key: "on_error",
        value: undefined,
        enumerable: true
    }, {
        key: "controller",
        value: undefined,
        enumerable: true
    }, {
        key: "emitChange",

        /*
        changed_nodes can be:
        - null; update all nodes
        - a single node; update this node (and its parents)
        - a list of nodes; update theses nodes (and their parents)
        */
        value: function emitChange() {
            var changed_nodes = arguments[0] === undefined ? null : arguments[0];

            this.changed_nodes = _toArray.toArray(changed_nodes);

            if (this.debug) {
                console.log("Emit change for node", formatNodes(this.changed_nodes));
            }

            var on_change = this.on_change;

            if (on_change) {
                on_change();
            }
        }
    }, {
        key: "handleKeyDown",
        value: function handleKeyDown(key_identifier) {
            if (!this.keyboard_support) {
                return;
            }

            var selected_node, changed_nodes;

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
                        this.closeNode(selected_node);
                    }
                    break;

                case "Right":
                    selected_node = this.tree.selected_node;

                    if (selected_node) {
                        this.openNode(selected_node);
                    }
                    break;
            }
        }
    }, {
        key: "toggleNode",
        value: function toggleNode(node) {
            if (node.is_open) {
                this.closeNode(node);
            } else {
                this.openNode(node);
            }
        }
    }, {
        key: "closeNode",
        value: function closeNode(node) {
            if (node.isFolder() && node.is_open) {
                node.close();

                this.emitChange(node);
                this.saveState();
            }
        }
    }, {
        key: "openNode",
        value: function openNode(node) {
            var _this = this;

            if (node.isFolder() && !node.is_open) {
                if (!node.load_on_demand) {
                    node.open();

                    this.emitChange(node);
                    this.saveState();
                } else {
                    node.loadOnDemand(node).then(function () {
                        node.open();

                        _this.emitChange(node);
                        _this.saveState();
                    });

                    this.emitChange(node);
                }
            }
        }
    }, {
        key: "selectNode",
        value: function selectNode(node) {
            var changed_nodes = node.select();

            if (changed_nodes.length) {
                this.emitChange(changed_nodes);
                this.saveState();
            }
        }
    }, {
        key: "openAllFolders",
        value: function openAllFolders() {
            return this.openFolders(null);
        }
    }, {
        key: "openFoldersAtLevel",
        value: function openFoldersAtLevel(level) {
            function mustContinue(node, node_level) {
                return node.isFolder() && node_level < level;
            }

            return this.openFolders(mustContinue);
        }
    }, {
        key: "startDragging",
        value: function startDragging(node, placeholder_height) {
            this.dragging = {
                node: node,
                placeholder_height: placeholder_height,
                hover_node: node
            };

            this.emitChange();
        }
    }, {
        key: "stopDragging",
        value: function stopDragging() {
            this.dragging = {};

            this.emitChange();
        }
    }, {
        key: "hoverNode",
        value: function hoverNode(node) {
            if (!this.isNodeHovered(node)) {
                var changed_nodes = [node];

                if (this.dragging.hover_node) {
                    changed_nodes.push(this.dragging.hover_node);
                }

                this.dragging.hover_node = node;

                this.emitChange(changed_nodes);
            }
        }
    }, {
        key: "isNodeHovered",
        value: function isNodeHovered(node) {
            var hover_node = this.dragging.hover_node;

            return hover_node && hover_node.id === node.id;
        }
    }, {
        key: "isNodeDragged",
        value: function isNodeDragged(node) {
            var dragged_node = this.dragging.node;

            return dragged_node && dragged_node.id === node.id;
        }
    }, {
        key: "openFolders",
        value: function openFolders(on_must_continue) {
            var emitChange = this.emitChange.bind(this);

            var iterator = new _LazyIterator.LazyIterator(this.tree);

            iterator.on_must_continue = on_must_continue;

            iterator.on_before_load = function (node) {
                emitChange(node);
            };

            iterator.on_visit = function (node) {
                if (node.isFolder()) {
                    node.open();
                    emitChange(node);
                }
            };

            return iterator.iterate().then(function () {
                if (iterator.visit_count === 0) {
                    emitChange();
                }
            });
        }
    }, {
        key: "createTree",

        // private

        // Create tree
        // return tuple [Tree, Promise]
        value: function createTree(data, url) {
            var tree = new _Tree$Node.Tree();

            var promise;

            if (data) {
                tree.loadFromData(data);
                promise = Promise.resolve();
            } else if (url) {
                promise = tree.loadFromUrl(url);
            } else {
                promise = Promise.resolve();
            }

            return [tree, promise];
        }
    }, {
        key: "initTree",

        // init tree
        // return Promise(is initialized)
        value: function initTree() {
            var restore_result = this.handleRestoreState();

            if (restore_result) {
                return restore_result;
            } else {
                return this.handleAutoOpen();
            }
        }
    }, {
        key: "fireInit",
        value: function fireInit() {
            var on_init = this.on_init;

            if (on_init) {
                on_init();
            }

            this.emit("init");
        }
    }, {
        key: "fireError",
        value: function fireError() {
            var on_error = this.on_error;

            if (on_error) {
                on_error();
            }
        }
    }, {
        key: "handleAutoOpen",
        value: function handleAutoOpen() {
            var auto_open = this.auto_open;

            if (typeof auto_open === "number") {
                return this.openFoldersAtLevel(auto_open);
            } else if (auto_open === true) {
                return this.openAllFolders();
            } else {
                return this.openFoldersAtLevel(1);
            }
        }
    }, {
        key: "getStateKey",
        value: function getStateKey() {
            var save_state = this.save_state;

            if (save_state === true) {
                return "jqtree";
            } else if (typeof save_state === "string") {
                return save_state;
            } else {
                return "";
            }
        }
    }, {
        key: "handleRestoreState",
        value: function handleRestoreState() {
            var state_key = this.getStateKey();

            if (state_key) {
                return this.loadState(state_key);
            } else {
                return null;
            }
        }
    }, {
        key: "loadState",
        value: function loadState(state_key) {
            function loadStateFromStorage() {
                var state_json = localStorage.getItem(state_key);

                if (!state_json) {
                    return false;
                } else {
                    var state = JSON.parse(state_json);

                    if (state) {
                        return state;
                    } else {
                        return false;
                    }
                }
            }

            var tree_state = loadStateFromStorage();

            if (typeof tree_state === "object") {
                return this.restoreState(tree_state);
            } else {
                return null;
            }
        }
    }, {
        key: "saveState",
        value: function saveState() {
            var state_key = this.getStateKey();
            if (state_key) {
                var tree_state = this.tree.getState();

                localStorage.setItem(state_key, JSON.stringify(tree_state));
            }
        }
    }, {
        key: "restoreState",
        value: function restoreState(tree_state) {
            var _this2 = this;

            var load_nodes_promises = {};

            // Make sure that the children of this node are loaded
            //
            // - the children are already loaded
            // or
            // - promise that the children will be loaded
            var ensureLoadChildren = function ensureLoadChildren(node) {
                if (!node.load_on_demand) {
                    // Node is already loaded
                    return Promise.resolve();
                } else {
                    // Node is loaded on demand
                    if (node.is_loading) {
                        // Node is loading; return existing promise
                        return load_nodes_promises[node.id];
                    } else {
                        // Load node; store promise
                        var promise = node.loadOnDemand();
                        _this2.emitChange();

                        load_nodes_promises[node.id] = promise;

                        return promise;
                    }
                }
            };

            var ensureLoadNodeById = function ensureLoadNodeById(node_id) {
                var node = _this2.tree.getNodeById(node_id);

                if (!node) {
                    // todo: this should not happen
                    return Promise.resolve();
                } else {
                    return ensureLoadChildren(node);
                }
            };

            // Ensure that nodes in this tree are loaded
            // Tree is defined by node_ids = [root, child of root, .., child]
            var ensureLoadTree = (function (_ensureLoadTree) {
                function ensureLoadTree(_x) {
                    return _ensureLoadTree.apply(this, arguments);
                }

                ensureLoadTree.toString = function () {
                    return _ensureLoadTree.toString();
                };

                return ensureLoadTree;
            })(function (node_ids) {
                return ensureLoadNodeById(node_ids[0]).then(function () {
                    node_ids.shift();

                    if (node_ids.length === 0) {
                        return Promise.resolve();
                    } else {
                        return ensureLoadTree(node_ids);
                    }
                });
            });

            var openNode = function openNode(node_info) {
                var node_id = node_info.id;
                var parent_ids = node_info.parents;

                // [node, parent, parent of parent, ..., root]
                var node_ids = [node_id].concat(parent_ids).reverse();

                return ensureLoadTree(node_ids).then(function () {
                    var node = _this2.tree.getNodeById(node_id);

                    if (node) {
                        node.open();
                        _this2.emitChange(node);
                    }

                    return Promise.resolve();
                });
            };

            var selectNode = function selectNode(node_info) {
                var node_id = node_info.id;
                var parent_ids = node_info.parents;

                var node_ids = parent_ids.reverse();

                return ensureLoadTree(node_ids).then(function () {
                    var node = _this2.tree.getNodeById(node_id);

                    if (node) {
                        node.select();
                        _this2.emitChange(node);
                    }
                });
            };

            var openNodes = function openNodes() {
                return Promise.all(tree_state.open.map(openNode));
            };

            var selectNodes = function selectNodes() {
                return Promise.all(tree_state.selected.map(selectNode));
            };

            if (!tree_state.open.length && !tree_state.selected.length) {
                this.emitChange();
                return Promise.resolve();
            } else {
                return openNodes().then(selectNodes);
            }
        }
    }, {
        key: "isNodeChanged",
        value: function isNodeChanged(node) {
            if (!this.changed_nodes.length) {
                return true;
            } else {
                return this.changed_nodes.some(function (changed_node) {
                    return changed_node.id === node.id || node.isParentOf(changed_node);
                });
            }
        }
    }]);

    return TreeStore;
})(_EventEmitter3["default"]);

exports.TreeStore = TreeStore;

function formatNodes(nodes) {
    if (!nodes) {
        return "";
    } else {
        var names = [];
        nodes.forEach(function (n) {
            names.push(n.name);
        });
        return names.join(" ");
    }
}