"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.create = create;
exports.toString = toString;
exports.nodeListToString = nodeListToString;
exports.hasChildren = hasChildren;
exports.getChildren = getChildren;
exports.iterateTree = iterateTree;
exports.iterateTreeAndLevel = iterateTreeAndLevel;
exports.getNodeByName = getNodeByName;
exports.doGetNodeByName = doGetNodeByName;
exports.addNode = addNode;
exports.removeNode = removeNode;
exports.updateNode = updateNode;
exports.getNextNode = getNextNode;
exports.getPreviousNode = getPreviousNode;

var _immutable = require("immutable");

var _lodash = require("lodash");

var _marked2 = [iterateTreeWithParents, iterateTree, iterateTreeAndLevel].map(regeneratorRuntime.mark);

var createEmptyTree = function createEmptyTree() {
    return createNode({ is_root: true });
};
var createNode = function createNode(data) {
    return (0, _immutable.Map)(data);
};
var createNodesFromData = function createNodesFromData(parent_id, children_data) {
    return (0, _immutable.List)(children_data.map(function (node_data) {
        return createNodeFromData(parent_id, node_data);
    }));
};
function createNodeFromData(parent_id, node_data) {
    function createChildren() {
        if (!node_data.children) {
            return null;
        } else {
            return createNodesFromData(node_data.id, node_data.children);
        }
    }
    return (0, _immutable.Map)(node_data).set("parent_id", parent_id).set("children", createChildren());
}
function create(children_data) {
    function createChildren() {
        if (children_data) {
            return createNodesFromData(null, children_data);
        } else {
            return (0, _immutable.List)();
        }
    }
    return createEmptyTree().set("children", createChildren());
}
function nodesToString(nodes) {
    return nodes.map(toString).join(" ");
}
function toString(node) {
    var children = getChildren(node);
    var has_children = !children.isEmpty();
    var is_root = node.get("is_root");
    var name = node.get("name");
    if (is_root) {
        if (!has_children) {
            return "";
        } else {
            return nodesToString(children);
        }
    } else if (!has_children) {
        return name;
    } else {
        return name + "(" + nodesToString(children) + ")";
    }
}
function nodeListToString(nodes) {
    return nodes.map(function (n) {
        if (n.get("is_root")) {
            return "[root]";
        } else {
            return n.get("name");
        }
    }).join(" ");
}
function hasChildren(node) {
    var children = node.get("children");
    if (!children) {
        return false;
    } else {
        return !children.isEmpty();
    }
}
function getChildren(node) {
    var children = node.get("children");
    if (children) {
        return children;
    } else {
        return (0, _immutable.List)();
    }
}
/* Iterates over tree. Return [node parents] pairs.
  - generator
  - walks depth-first
*/
function treeSeqPath(is_branch, get_children, root) {
    var _marked = [walk].map(regeneratorRuntime.mark);

    function walk(path, node) {
        var children, new_path, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, child;

        return regeneratorRuntime.wrap(function walk$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return [node, path.toArray()];

                    case 2:
                        if (!is_branch(node)) {
                            _context.next = 30;
                            break;
                        }

                        children = get_children(node);
                        new_path = path.push(node);
                        _iteratorNormalCompletion = true;
                        _didIteratorError = false;
                        _iteratorError = undefined;
                        _context.prev = 8;
                        _iterator = children[Symbol.iterator]();

                    case 10:
                        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                            _context.next = 16;
                            break;
                        }

                        child = _step.value;
                        return _context.delegateYield(walk(new_path, child), "t0", 13);

                    case 13:
                        _iteratorNormalCompletion = true;
                        _context.next = 10;
                        break;

                    case 16:
                        _context.next = 22;
                        break;

                    case 18:
                        _context.prev = 18;
                        _context.t1 = _context["catch"](8);
                        _didIteratorError = true;
                        _iteratorError = _context.t1;

                    case 22:
                        _context.prev = 22;
                        _context.prev = 23;

                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }

                    case 25:
                        _context.prev = 25;

                        if (!_didIteratorError) {
                            _context.next = 28;
                            break;
                        }

                        throw _iteratorError;

                    case 28:
                        return _context.finish(25);

                    case 29:
                        return _context.finish(22);

                    case 30:
                    case "end":
                        return _context.stop();
                }
            }
        }, _marked[0], this, [[8, 18, 22, 30], [23,, 25, 29]]);
    }
    return walk((0, _immutable.List)(), root);
}
// Iterate tree; return lazy sequence of readonly nodes
// - skip root
function iterateTreeWithParents(root) {
    var _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _step2$value, node, parents;

    return regeneratorRuntime.wrap(function iterateTreeWithParents$(_context2) {
        while (1) {
            switch (_context2.prev = _context2.next) {
                case 0:
                    _iteratorNormalCompletion2 = true;
                    _didIteratorError2 = false;
                    _iteratorError2 = undefined;
                    _context2.prev = 3;
                    _iterator2 = treeSeqPath(hasChildren, getChildren, root)[Symbol.iterator]();

                case 5:
                    if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                        _context2.next = 13;
                        break;
                    }

                    _step2$value = _slicedToArray(_step2.value, 2), node = _step2$value[0], parents = _step2$value[1];

                    if (!(node !== root)) {
                        _context2.next = 10;
                        break;
                    }

                    _context2.next = 10;
                    return { node: node, parents: parents };

                case 10:
                    _iteratorNormalCompletion2 = true;
                    _context2.next = 5;
                    break;

                case 13:
                    _context2.next = 19;
                    break;

                case 15:
                    _context2.prev = 15;
                    _context2.t0 = _context2["catch"](3);
                    _didIteratorError2 = true;
                    _iteratorError2 = _context2.t0;

                case 19:
                    _context2.prev = 19;
                    _context2.prev = 20;

                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }

                case 22:
                    _context2.prev = 22;

                    if (!_didIteratorError2) {
                        _context2.next = 25;
                        break;
                    }

                    throw _iteratorError2;

                case 25:
                    return _context2.finish(22);

                case 26:
                    return _context2.finish(19);

                case 27:
                case "end":
                    return _context2.stop();
            }
        }
    }, _marked2[0], this, [[3, 15, 19, 27], [20,, 22, 26]]);
}
function treeSeq(is_branch, get_children, root, include_root) {
    var _marked3 = [walk].map(regeneratorRuntime.mark);

    function walk(node, level) {
        var _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, child;

        return regeneratorRuntime.wrap(function walk$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        if (!(node !== root || include_root)) {
                            _context3.next = 3;
                            break;
                        }

                        _context3.next = 3;
                        return [node, level];

                    case 3:
                        if (!is_branch(node)) {
                            _context3.next = 29;
                            break;
                        }

                        _iteratorNormalCompletion3 = true;
                        _didIteratorError3 = false;
                        _iteratorError3 = undefined;
                        _context3.prev = 7;
                        _iterator3 = get_children(node)[Symbol.iterator]();

                    case 9:
                        if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                            _context3.next = 15;
                            break;
                        }

                        child = _step3.value;
                        return _context3.delegateYield(walk(child, level + 1), "t0", 12);

                    case 12:
                        _iteratorNormalCompletion3 = true;
                        _context3.next = 9;
                        break;

                    case 15:
                        _context3.next = 21;
                        break;

                    case 17:
                        _context3.prev = 17;
                        _context3.t1 = _context3["catch"](7);
                        _didIteratorError3 = true;
                        _iteratorError3 = _context3.t1;

                    case 21:
                        _context3.prev = 21;
                        _context3.prev = 22;

                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }

                    case 24:
                        _context3.prev = 24;

                        if (!_didIteratorError3) {
                            _context3.next = 27;
                            break;
                        }

                        throw _iteratorError3;

                    case 27:
                        return _context3.finish(24);

                    case 28:
                        return _context3.finish(21);

                    case 29:
                    case "end":
                        return _context3.stop();
                }
            }
        }, _marked3[0], this, [[7, 17, 21, 29], [22,, 24, 28]]);
    }
    return walk(root, 0);
}
function iterateTree(root) {
    var include_root = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, _step4$value, _node, _;

    return regeneratorRuntime.wrap(function iterateTree$(_context4) {
        while (1) {
            switch (_context4.prev = _context4.next) {
                case 0:
                    _iteratorNormalCompletion4 = true;
                    _didIteratorError4 = false;
                    _iteratorError4 = undefined;
                    _context4.prev = 3;
                    _iterator4 = treeSeq(hasChildren, getChildren, root, include_root)[Symbol.iterator]();

                case 5:
                    if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
                        _context4.next = 12;
                        break;
                    }

                    _step4$value = _slicedToArray(_step4.value, 2), _node = _step4$value[0], _ = _step4$value[1];
                    _context4.next = 9;
                    return _node;

                case 9:
                    _iteratorNormalCompletion4 = true;
                    _context4.next = 5;
                    break;

                case 12:
                    _context4.next = 18;
                    break;

                case 14:
                    _context4.prev = 14;
                    _context4.t0 = _context4["catch"](3);
                    _didIteratorError4 = true;
                    _iteratorError4 = _context4.t0;

                case 18:
                    _context4.prev = 18;
                    _context4.prev = 19;

                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }

                case 21:
                    _context4.prev = 21;

                    if (!_didIteratorError4) {
                        _context4.next = 24;
                        break;
                    }

                    throw _iteratorError4;

                case 24:
                    return _context4.finish(21);

                case 25:
                    return _context4.finish(18);

                case 26:
                case "end":
                    return _context4.stop();
            }
        }
    }, _marked2[1], this, [[3, 14, 18, 26], [19,, 21, 25]]);
}
function iterateTreeAndLevel(root) {
    return regeneratorRuntime.wrap(function iterateTreeAndLevel$(_context5) {
        while (1) {
            switch (_context5.prev = _context5.next) {
                case 0:
                    return _context5.delegateYield(treeSeq(hasChildren, getChildren, root, false), "t0", 1);

                case 1:
                case "end":
                    return _context5.stop();
            }
        }
    }, _marked2[2], this);
}
// Find node by name; return readonly node or nil
function getNodeByName(root, name) {
    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
        for (var _iterator5 = iterateTreeWithParents(root)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var readonly_node = _step5.value;

            if (readonly_node.node.get("name") === name) {
                var _node2 = readonly_node.node,
                    _parents = readonly_node.parents;

                return {
                    node: _node2,
                    parents: _parents.reverse()
                };
            }
        }
    } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion5 && _iterator5.return) {
                _iterator5.return();
            }
        } finally {
            if (_didIteratorError5) {
                throw _iteratorError5;
            }
        }
    }

    return null;
}
function doGetNodeByName(root, name) {
    var result = getNodeByName(root, name);
    if (!result) {
        throw Error("Node " + name + " not found");
    }
    return result;
}
// Add node
//  - return [new-root {new-child changed-nodes}]
function addNode(root, readonly_parent, child_data) {
    if (child_data) {
        return addNodeToNonRoot(readonly_parent, createNode(child_data));
    } else {
        var data = readonly_parent;
        return addNodeToRoot(root, createNode(data));
    }
}
function addNodeToNonRoot(readonly_parent, child) {
    var parent = readonly_parent.node;
    var new_child = child.set("parent_id", parent.get("id"));
    var new_parent = addChild(parent, new_child);

    var _updateParents = updateParents(parent, new_parent, readonly_parent.parents),
        _updateParents2 = _slicedToArray(_updateParents, 2),
        new_root = _updateParents2[0],
        changed_nodes = _updateParents2[1];

    return [new_root, {
        new_child: new_child,
        changed_nodes: [new_parent].concat(changed_nodes)
    }];
}
function addNodeToRoot(root, child) {
    var new_root = addChild(root, child);
    return [new_root, {
        new_child: child,
        changed_nodes: []
    }];
}
function addChild(parent, child) {
    var children = getChildren(parent);
    return parent.set("children", children.push(child));
}
/*
  Update parent of updated-node; also update the parents of the parent

  - 'old-child' is replaced by 'new-child'
  - 'parents' are the parents of the child; direct parent first
  - returns: [new root, affected]
*/
function updateParents(initial_old_child, intitial_new_child, parents) {
    var old_child = initial_old_child;
    var new_child = intitial_new_child;
    var new_parents = parents.map(function (parent) {
        var new_parent = replaceChild(parent, old_child, new_child);
        old_child = parent;
        new_child = new_parent;
        return new_parent;
    });
    return [(0, _lodash.last)(new_parents), (0, _lodash.dropRight)(new_parents)];
}
function replaceChild(node, old_child, new_child) {
    var children = getChildren(node);
    var child_index = children.indexOf(old_child);
    var new_children = children.set(child_index, new_child);
    return node.set("children", new_children);
}
/*
  Remove node
  - return {new_root changed_nodes removed_nodes}
*/
function removeNode(readonly_child) {
    var child = readonly_child.node;
    var parents = readonly_child.parents;

    var parent = (0, _lodash.first)(parents);
    if (parent.get("is_root")) {
        return removeNodeFromRoot(parent, child);
    } else {
        return removeNodeFromParent(parents, child);
    }
}
function removeNodeFromRoot(root, child) {
    var new_root = removeChild(root, child);
    var removed_nodes = Array.from(iterateTree(child, true));
    return [new_root, {
        changed_nodes: [],
        removed_nodes: removed_nodes
    }];
}
function removeNodeFromParent(parents, child) {
    var parent = (0, _lodash.first)(parents);
    var new_parent = removeChild(parent, child);

    var _updateParents3 = updateParents(parent, new_parent, (0, _lodash.tail)(parents)),
        _updateParents4 = _slicedToArray(_updateParents3, 2),
        new_root = _updateParents4[0],
        changed_parents = _updateParents4[1];

    var removed_nodes = Array.from(iterateTree(child, true));
    return [new_root, {
        changed_nodes: [new_parent].concat(changed_parents),
        removed_nodes: removed_nodes
    }];
}
function removeChild(node, child) {
    var children = getChildren(node);
    var child_index = children.indexOf(child);
    var new_children = children.delete(child_index);
    return node.set("children", new_children);
}
function updateNode(readonly_node, attributes) {
    var node = readonly_node.node,
        parents = readonly_node.parents;

    var new_node = node.merge(attributes);

    var _updateParents5 = updateParents(node, new_node, parents),
        _updateParents6 = _slicedToArray(_updateParents5, 2),
        new_root = _updateParents6[0],
        changed_parents = _updateParents6[1];

    return [new_root, {
        changed_nodes: [new_node].concat(changed_parents)
    }];
}
function getNextNode(readonly_node) {
    var include_children = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var node = readonly_node.node;

    if (include_children && hasChildren(node) && node.get("is_open")) {
        // First child
        return getChildren(node).first();
    } else {
        var next_sibling = getNextSibling(readonly_node);
        if (next_sibling) {
            // Next sibling
            return next_sibling;
        } else {
            var readonly_parent = getReadonlyParent(readonly_node);
            if (!readonly_parent) {
                return null;
            } else {
                return getNextNode(readonly_parent, false);
            }
        }
    }
}
function getReadonlyParent(node) {
    var parents = node.parents;

    var parent = (0, _lodash.first)(parents);
    if (!parent) {
        return null;
    } else {
        return {
            node: parent,
            parents: (0, _lodash.tail)(parents)
        };
    }
}
function getPreviousNode(readonly_node) {
    var previous_sibling = getPreviousSibling(readonly_node);
    if (!previous_sibling) {
        // Parent
        var parent = (0, _lodash.first)(readonly_node.parents);
        if (parent.get("is_root")) {
            return null;
        } else {
            return parent;
        }
    } else {
        if (!hasChildren(previous_sibling) || !previous_sibling.get("is_open")) {
            // Previous sibling
            return previous_sibling;
        } else {
            // Last child of previous sibling
            return getChildren(previous_sibling).last();
        }
    }
}
function getChildIndex(parent, child) {
    var index = getChildren(parent).indexOf(child);
    if (index === -1) {
        return null;
    } else {
        return index;
    }
}
function getNextSibling(readonly_node) {
    var node = readonly_node.node,
        parents = readonly_node.parents;

    var parent = (0, _lodash.first)(parents);
    if (!parent) {
        return null;
    } else {
        var child_index = getChildIndex(parent, node);
        if (child_index === null) {
            return null;
        } else {
            return getChildren(parent).get(child_index + 1);
        }
    }
}
function getPreviousSibling(readonly_node) {
    var node = readonly_node.node,
        parents = readonly_node.parents;

    var parent = (0, _lodash.first)(parents);
    if (!parent) {
        return null;
    } else {
        var child_index = getChildIndex(parent, node);
        if (child_index === null || child_index === 0) {
            return null;
        } else {
            return getChildren(parent).get(child_index - 1);
        }
    }
}
//# sourceMappingURL=immutable_node.js.map
