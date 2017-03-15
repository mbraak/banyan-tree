"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Tree = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _immutable = require("immutable");

var _immutable_node = require("./immutable_node");

var node = _interopRequireWildcard(_immutable_node);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tree = exports.Tree = function () {
    function Tree() {
        var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        _classCallCheck(this, Tree);

        this.root = node.create(data);
        this.ids = createIdMap(this.root);
        this.selected = null;
    }

    _createClass(Tree, [{
        key: "toString",
        value: function toString() {
            return node.toString(this.root);
        }
    }, {
        key: "getChildren",
        value: function getChildren() {
            return node.getChildren(this.root);
        }
    }, {
        key: "hasChildren",
        value: function hasChildren() {
            return node.hasChildren(this.root);
        }
        // todo: reverse params

    }, {
        key: "addNode",
        value: function addNode(parent, child) {
            if (!child) {
                return this.addNodeToRoot(parent);
            } else {
                return this.addNodeToParent(parent, child);
            }
        }
    }, {
        key: "getNodeByName",
        value: function getNodeByName(name) {
            var found_node = node.getNodeByName(this.root, name);
            if (!found_node) {
                return null;
            } else {
                return found_node.node;
            }
        }
    }, {
        key: "doGetNodeByName",
        value: function doGetNodeByName(name) {
            return node.doGetNodeByName(this.root, name).node;
        }
    }, {
        key: "removeNode",
        value: function removeNode(n) {
            var _node$removeNode = node.removeNode(this.getReadonlyNode(n)),
                _node$removeNode2 = _slicedToArray(_node$removeNode, 2),
                new_root = _node$removeNode2[0],
                affected_info = _node$removeNode2[1];

            return this.updateTree(new_root, affected_info.changed_nodes, affected_info.removed_nodes.map(function (removed_node) {
                return removed_node.id;
            }));
        }
    }, {
        key: "getNodeById",
        value: function getNodeById(id) {
            return this.ids.get(id);
        }
    }, {
        key: "doGetNodeById",
        value: function doGetNodeById(id) {
            var result = this.getNodeById(id);
            if (!result) {
                throw Error("Node with id '" + id + " not found");
            }
            return result;
        }
    }, {
        key: "openNode",
        value: function openNode(id) {
            var n = this.getNodeById(id);
            if (!n) {
                return this;
            } else {
                return this.updateNode(n, { is_open: true });
            }
        }
    }, {
        key: "closeNode",
        value: function closeNode(id) {
            var n = this.getNodeById(id);
            if (!n) {
                return this;
            } else {
                return this.updateNode(n, { is_open: false });
            }
        }
    }, {
        key: "isNodeOpen",
        value: function isNodeOpen(id) {
            var n = this.getNodeById(id);
            if (!n) {
                return false;
            } else {
                return Boolean(n.is_open);
            }
        }
    }, {
        key: "selectNode",
        value: function selectNode(id) {
            var t = this.deselect();
            var n = t.getNodeById(id);
            if (!n) {
                return t;
            } else {
                t.selected = id;
                return t.updateNode(n, { is_selected: true });
            }
        }
    }, {
        key: "toggleNode",
        value: function toggleNode(id) {
            if (this.isNodeOpen(id)) {
                return this.closeNode(id);
            } else {
                return this.openNode(id);
            }
        }
    }, {
        key: "updateNode",
        value: function updateNode(n, attributes) {
            var _node$updateNode = node.updateNode(this.getReadonlyNode(n), attributes),
                _node$updateNode2 = _slicedToArray(_node$updateNode, 2),
                new_root = _node$updateNode2[0],
                update_info = _node$updateNode2[1];

            return this.updateTree(new_root, update_info.changed_nodes, []);
        }
    }, {
        key: "openAllFolders",
        value: function openAllFolders() {
            var tree = this;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = node.iterateTree(this.root)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var n = _step.value;

                    tree = tree.openNode(n.id);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return tree;
        }
    }, {
        key: "getSelectedNode",
        value: function getSelectedNode() {
            if (!this.selected) {
                return null;
            } else {
                return this.getNodeById(this.selected);
            }
        }
    }, {
        key: "addNodeToRoot",
        value: function addNodeToRoot(child) {
            var _node$addNode = node.addNode(this.root, child),
                _node$addNode2 = _slicedToArray(_node$addNode, 2),
                new_root = _node$addNode2[0],
                update_info = _node$addNode2[1];

            return this.updateTree(new_root, [update_info.new_child], []);
        }
    }, {
        key: "addNodeToParent",
        value: function addNodeToParent(parent, child) {
            var readonly_parent = this.getReadonlyNode(parent);

            var _node$addNode3 = node.addNode(this.root, readonly_parent, child),
                _node$addNode4 = _slicedToArray(_node$addNode3, 2),
                new_root = _node$addNode4[0],
                update_info = _node$addNode4[1];

            return this.updateTree(new_root, update_info.changed_nodes.concat([update_info.new_child]), []);
        }
    }, {
        key: "getReadonlyNode",
        value: function getReadonlyNode(n) {
            return {
                node: n,
                parents: this.getParents(n)
            };
        }
    }, {
        key: "getParents",
        value: function getParents(n) {
            if (n.is_root) {
                return [];
            } else {
                var parents = [];
                var current_node = n;
                while (current_node && current_node.parent_id) {
                    var parent = this.getNodeById(current_node.parent_id);
                    if (parent) {
                        parents.push(parent);
                    }
                    current_node = parent;
                }
                parents.push(this.root);
                return parents;
            }
        }
    }, {
        key: "updateTree",
        value: function updateTree(new_root, updated_nodes, deleted_ids) {
            var new_ids = this.updateIds(updated_nodes, deleted_ids);
            var new_tree = this.createCopy();
            new_tree.ids = new_ids;
            new_tree.root = new_root;
            return new_tree;
        }
    }, {
        key: "createCopy",
        value: function createCopy() {
            var new_tree = new Tree();
            new_tree.ids = this.ids;
            new_tree.root = this.root;
            new_tree.selected = this.selected;
            return new_tree;
        }
    }, {
        key: "updateIds",
        value: function updateIds(updated_nodes, deleted_ids) {
            var updates_node_map = (0, _immutable.Map)(updated_nodes.map(function (n) {
                return [n.id, n];
            }));
            var new_ids = this.ids.merge(updates_node_map);
            deleted_ids.forEach(function (id) {
                new_ids = new_ids.delete(id);
            });
            return new_ids;
        }
    }, {
        key: "deselect",
        value: function deselect() {
            if (!this.selected) {
                return this;
            } else {
                var n = this.getNodeById(this.selected);
                if (!n) {
                    return this;
                } else {
                    var new_tree = this.updateNode(n, { is_selected: false });
                    new_tree.selected = null;
                    return new_tree;
                }
            }
        }
    }]);

    return Tree;
}();

function createIdMap(root) {
    var _marked = [iteratePairs].map(regeneratorRuntime.mark);

    function iteratePairs() {
        var _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, n;

        return regeneratorRuntime.wrap(function iteratePairs$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _iteratorNormalCompletion2 = true;
                        _didIteratorError2 = false;
                        _iteratorError2 = undefined;
                        _context.prev = 3;
                        _iterator2 = node.iterateTree(root)[Symbol.iterator]();

                    case 5:
                        if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                            _context.next = 12;
                            break;
                        }

                        n = _step2.value;
                        _context.next = 9;
                        return [n.id, n];

                    case 9:
                        _iteratorNormalCompletion2 = true;
                        _context.next = 5;
                        break;

                    case 12:
                        _context.next = 18;
                        break;

                    case 14:
                        _context.prev = 14;
                        _context.t0 = _context["catch"](3);
                        _didIteratorError2 = true;
                        _iteratorError2 = _context.t0;

                    case 18:
                        _context.prev = 18;
                        _context.prev = 19;

                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }

                    case 21:
                        _context.prev = 21;

                        if (!_didIteratorError2) {
                            _context.next = 24;
                            break;
                        }

                        throw _iteratorError2;

                    case 24:
                        return _context.finish(21);

                    case 25:
                        return _context.finish(18);

                    case 26:
                    case "end":
                        return _context.stop();
                }
            }
        }, _marked[0], this, [[3, 14, 18, 26], [19,, 21, 25]]);
    }
    return (0, _immutable.Map)(iteratePairs());
}
//# sourceMappingURL=immutable_tree.js.map
