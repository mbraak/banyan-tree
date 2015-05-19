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
// change import for flow

var _EventEmitter2 = require("eventemitter3");

var _EventEmitter3 = _interopRequireWildcard(_EventEmitter2);

var _invariant = require("react/lib/invariant");

var _invariant2 = _interopRequireWildcard(_invariant);

var _xhttp = require("xhttp");

var _xhttp2 = _interopRequireWildcard(_xhttp);

var _copyProperties = require("./utils");

var _Position = require("./position");

/* @flow */
require("core-js");

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

var Node = (function (_EventEmitter) {

    /*
    Constructor
     The properties parameter must contain the keys "id" and "name"
    */

    function Node(properties) {
        _classCallCheck(this, Node);

        _get(Object.getPrototypeOf(Node.prototype), "constructor", this).call(this);

        // todo: check required keys
        this.assignProperties(properties);

        this.children = [];
        this.parent = null;

        this.is_selected = false;
        this.is_open = false;
        this.is_loading = false;
    }

    _inherits(Node, _EventEmitter);

    _createClass(Node, [{
        key: "id",
        value: undefined,
        enumerable: true
    }, {
        key: "name",
        value: undefined,
        enumerable: true
    }, {
        key: "load_on_demand",
        value: undefined,
        enumerable: true
    }, {
        key: "tree",
        value: undefined,
        enumerable: true
    }, {
        key: "is_selected",
        value: undefined,
        enumerable: true
    }, {
        key: "is_open",
        value: undefined,
        enumerable: true
    }, {
        key: "is_loading",
        value: undefined,
        enumerable: true
    }, {
        key: "parent",
        value: undefined,
        enumerable: true
    }, {
        key: "children",
        value: undefined,
        enumerable: true
    }, {
        key: "properties",
        value: undefined,
        enumerable: true
    }, {
        key: "assignProperties",
        value: function assignProperties(properties) {
            this.name = properties.name;
            this.id = properties.id;

            if (properties.load_on_demand) {
                this.load_on_demand = true;
            } else {
                this.load_on_demand = false;
            }

            this.properties = _copyProperties.copyProperties(properties, ["id", "name", "children", "load_on_demand"]);
        }
    }, {
        key: "loadFromData",

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
        value: function loadFromData(data) {
            _invariant2["default"](Array.isArray(data), "loadFromData: parameter 'data' must be an array");
            this.removeChildren();

            var parent = this;

            data.forEach(function (properties) {
                var node = new Node(properties);

                parent.addChild(node);

                if (properties.children && properties.children.length) {
                    node.loadFromData(properties.children);
                }
            });
        }
    }, {
        key: "addChild",

        /*
        Add child.
         tree.addChild(
            new Node("child1")
        );
        */
        value: function addChild(node) {
            this.children.push(node);
            node.setParent(this);
        }
    }, {
        key: "addChildAtPosition",

        /*
        Add child at position. Index starts at 0.
         tree.addChildAtPosition(
            new Node("abc"),
            1
        );
        */
        value: function addChildAtPosition(node, index) {
            this.children.splice(index, 0, node);
            node.setParent(this);
        }
    }, {
        key: "setParent",
        value: function setParent(parent) {
            this.parent = parent;
            this.tree = parent.tree;
            this.tree.addNodeToIndex(this);
        }
    }, {
        key: "removeChildren",
        value: function removeChildren() {
            // remove childen from the tree index
            var tree = this.tree;

            function removeFromIndex(node) {
                tree.removeNodeFromIndex(node);
                return true;
            }

            // iterate excluding self
            this.do_iterate(removeFromIndex, false);

            // remove children from node
            this.children = [];
        }
    }, {
        key: "removeChild",

        /*
        Remove child. This also removes the children of the node.
         tree.removeChild(tree.children[0]);
        */
        value: function removeChild(node) {
            var include_children = arguments[1] === undefined ? true : arguments[1];

            if (!node) {
                return;
            }

            if (include_children) {
                // remove children from the index
                node.removeChildren();
            }

            this.children.splice(this.getChildIndex(node), 1);
            this.tree.removeNodeFromIndex(node);
        }
    }, {
        key: "iterate",

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
        value: function iterate(on_node) {
            this.do_iterate(on_node, true);
        }
    }, {
        key: "do_iterate",
        value: function do_iterate(on_node) {
            var include_self = arguments[1] === undefined ? true : arguments[1];

            function iterate_node(node, level, include_node) {
                function visitNode() {
                    return on_node(node, level);
                }

                if (!include_node || visitNode()) {
                    if (node.hasChildren()) {
                        node.children.forEach(function (child) {
                            iterate_node(child, level + 1, true);
                        });
                    }
                }
            }

            iterate_node(this, 0, include_self);
        }
    }, {
        key: "hasChildren",

        /*
        Does the node have children?
         if (node.hasChildren()) {
            //
        }
        */
        value: function hasChildren() {
            return this.children.length !== 0;
        }
    }, {
        key: "isFolder",

        /*
        Is the node a folder?
        */
        value: function isFolder() {
            return this.hasChildren() || this.load_on_demand;
        }
    }, {
        key: "getChildIndex",

        /*
        Get child index.
         var index = getChildIndex(node);
        */
        value: function getChildIndex(node) {
            return this.children.indexOf(node);
        }
    }, {
        key: "isParentOf",

        /*
        Is this node the parent of the parameter node?
        */
        value: function isParentOf(node) {
            if (!node) {
                return false;
            } else {
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
    }, {
        key: "getNextNode",
        value: function getNextNode() {
            if (this.hasChildren() && this.is_open) {
                // First child
                return this.children[0];
            } else {
                return this.getNextNodeSkipChildren();
            }
        }
    }, {
        key: "getNextNodeSkipChildren",
        value: function getNextNodeSkipChildren() {
            var parent = this.parent;

            if (parent == null) {
                return null;
            } else {
                var next_sibling = this.getNextSibling();
                if (next_sibling) {
                    // Next sibling
                    return next_sibling;
                } else {
                    // Next node of parent
                    return parent.getNextNodeSkipChildren();
                }
            }
        }
    }, {
        key: "getPreviousNode",
        value: function getPreviousNode() {
            var parent = this.parent;

            if (parent == null) {
                return null;
            } else {
                var previous_sibling = this.getPreviousSibling();
                if (previous_sibling) {
                    if (!previous_sibling.hasChildren() || !previous_sibling.is_open) {
                        // Previous sibling
                        return previous_sibling;
                    } else {
                        // Last child of previous sibling
                        return previous_sibling.getLastChild();
                    }
                } else {
                    // Parent
                    if (parent.parent) {
                        return parent;
                    } else {
                        return null;
                    }
                }
            }
        }
    }, {
        key: "getPreviousSibling",
        value: function getPreviousSibling() {
            var parent = this.parent;

            if (parent == null) {
                return null;
            } else {
                var previous_index = parent.getChildIndex(this) - 1;
                if (previous_index >= 0) {
                    return parent.children[previous_index];
                } else {
                    return null;
                }
            }
        }
    }, {
        key: "getNextSibling",
        value: function getNextSibling() {
            var parent = this.parent;

            if (parent == null) {
                return null;
            } else {
                var next_index = parent.getChildIndex(this) + 1;
                if (next_index < parent.children.length) {
                    return parent.children[next_index];
                } else {
                    return null;
                }
            }
        }
    }, {
        key: "getLastChild",
        value: function getLastChild() {
            if (!this.hasChildren()) {
                return null;
            } else {
                var last_child = this.children[this.children.length - 1];
                if (!last_child.hasChildren() || !last_child.is_open) {
                    return last_child;
                } else {
                    return last_child.getLastChild();
                }
            }
        }
    }, {
        key: "open",
        value: function open() {
            if (this.isFolder()) {
                this.is_open = true;
                this.tree.emit("open", this);
            }
        }
    }, {
        key: "close",
        value: function close() {
            if (this.isFolder()) {
                this.is_open = false;
                this.tree.emit("close", this);
            }
        }
    }, {
        key: "select",
        value: function select() {
            return this.tree.selectNode(this);
        }
    }, {
        key: "loadFromUrl",

        /*
        Load node and children from this url.
         Return promise(data is loaded)
        */
        value: function loadFromUrl(url) {
            if (!url) {
                return Promise.resolve();
            } else {
                var node = this;

                node.is_loading = true;

                var promise = _xhttp2["default"]({ url: url });

                return promise.then(function (tree_data) {
                    node.is_loading = false;
                    node.loadFromData(tree_data);
                });
            }
        }
    }, {
        key: "loadOnDemand",

        /*
        Load node data on demand. The url is determined using the base url from the tree.
         Return promise(data is loaded)
        */
        value: function loadOnDemand() {
            var base_url = this.tree.base_url;

            if (!base_url) {
                return Promise.resolve();
            } else {
                var promise = this.loadFromUrl(base_url + "?node=" + this.id);
                var node = this;

                promise.then(function () {
                    node.load_on_demand = false;
                });

                return promise;
            }
        }
    }, {
        key: "getState",
        value: function getState() {
            var _this = this;

            var getOpenAndSelectedNodes = function getOpenAndSelectedNodes() {
                var open_nodes = [];
                var selected_nodes = [];

                _this.iterate(function (node) {
                    if (node.is_open) {
                        open_nodes.push(node);
                    }

                    if (node.is_selected) {
                        selected_nodes.push(node);
                    }

                    return true;
                });

                return [open_nodes, selected_nodes];
            };

            var getNodeInfo = function getNodeInfo(node) {
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

            var _getOpenAndSelectedNodes = getOpenAndSelectedNodes();

            var _getOpenAndSelectedNodes2 = _slicedToArray(_getOpenAndSelectedNodes, 2);

            var open = _getOpenAndSelectedNodes2[0];
            var selected = _getOpenAndSelectedNodes2[1];

            return {
                open: open.map(getNodeInfo),
                selected: selected.map(getNodeInfo)
            };
        }
    }]);

    return Node;
})(_EventEmitter3["default"]);

exports.Node = Node;

var Tree = (function (_Node) {
    function Tree() {
        _classCallCheck(this, Tree);

        _get(Object.getPrototypeOf(Tree.prototype), "constructor", this).call(this, {});

        this.id_mapping = new Map();
        this.tree = this;
        this.selected_node = null;
        this.base_url = "";
    }

    _inherits(Tree, _Node);

    _createClass(Tree, [{
        key: "id_mapping",
        value: undefined,
        enumerable: true
    }, {
        key: "selected_node",
        value: undefined,
        enumerable: true
    }, {
        key: "base_url",
        value: undefined,
        enumerable: true
    }, {
        key: "tree",
        value: undefined,
        enumerable: true
    }, {
        key: "selectNode",

        /*
        Select this node
        Returns changed nodes
        */
        value: function selectNode(node) {
            if (node === this.selected_node) {
                return [];
            } else {
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
    }, {
        key: "deselectCurrentNode",
        value: function deselectCurrentNode() {
            var selected_node = this.selected_node;

            if (selected_node == null) {
                return [];
            } else {
                selected_node.is_selected = false;
                this.selected_node = null;
                return [selected_node];
            }
        }
    }, {
        key: "removeNodeFromIndex",
        value: function removeNodeFromIndex(node) {
            this.id_mapping["delete"](node.id);
        }
    }, {
        key: "addNodeToIndex",
        value: function addNodeToIndex(node) {
            this.id_mapping.set(node.id, node);
        }
    }, {
        key: "getNodeById",
        value: function getNodeById(node_id) {
            return this.id_mapping.get(node_id);
        }
    }, {
        key: "getNodeByName",
        value: function getNodeByName(name) {
            var result = null;

            this.iterate(function (node) {
                if (node.name === name) {
                    result = node;
                    return false;
                } else {
                    return true;
                }
            });

            return result;
        }
    }, {
        key: "iterate",
        value: function iterate(on_node) {
            return this.do_iterate(on_node, false);
        }
    }, {
        key: "moveDown",
        value: function moveDown() {
            var selected_node = this.selected_node;

            if (!selected_node) {
                return [];
            } else {
                var node = selected_node.getNextNode();
                if (!node) {
                    return [];
                } else {
                    return this.selectNode(node);
                }
            }
        }
    }, {
        key: "moveUp",
        value: function moveUp() {
            var selected_node = this.selected_node;

            if (!selected_node) {
                return [];
            } else {
                var node = selected_node.getPreviousNode();

                if (!node) {
                    return [];
                } else {
                    return this.selectNode(node);
                }
            }
        }
    }, {
        key: "moveNode",

        /*
        Move node relative to another node.
         Argument position: Position.BEFORE, Position.AFTER or Position.Inside
         // move node1 after node2
        tree.moveNode(node1, node2, Position.AFTER);
        */
        value: function moveNode(moved_node, target_node, position) {
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

                if (position === _Position.Position.AFTER) {
                    if (target_parent) {
                        target_parent.addChildAtPosition(moved_node, target_parent.getChildIndex(target_node) + 1);
                    }
                } else if (position === _Position.Position.BEFORE) {
                    if (target_parent) {
                        target_parent.addChildAtPosition(moved_node, target_parent.getChildIndex(target_node));
                    }
                } else if (position === _Position.Position.INSIDE) {
                    // move inside as first child
                    target_node.addChildAtPosition(moved_node, 0);
                }
            }
        }
    }, {
        key: "loadFromUrl",
        value: function loadFromUrl(url) {
            this.base_url = url;

            return _get(Object.getPrototypeOf(Tree.prototype), "loadFromUrl", this).call(this, url);
        }
    }]);

    return Tree;
})(Node);

exports.Tree = Tree;