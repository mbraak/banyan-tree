"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createReducerForTreeId = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.reduceTree = reduceTree;

var _actions = require("./actions");

var actions = _interopRequireWildcard(_actions);

var _immutable_tree = require("../immutable_tree");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var createReducerForTreeId = exports.createReducerForTreeId = function createReducerForTreeId(tree_id) {
    return function (tree, action) {
        if (tree_id !== action.tree_id) {
            if (!tree) {
                return new _immutable_tree.Tree();
            } else {
                return tree;
            }
        } else {
            return reduceTree(tree, action);
        }
    };
};
function reduceTree(tree, action) {
    switch (action.type) {
        case actions.SELECT_NODE:
            return tree.selectNode(action.node_id);
        case actions.TOGGLE_NODE:
            return tree.toggleNode(action.node_id);
        case actions.HANDLE_KEY:
            var _tree$handleKey = tree.handleKey(action.key),
                _tree$handleKey2 = _slicedToArray(_tree$handleKey, 2),
                new_tree = _tree$handleKey2[1];

            return new_tree;
        default:
            if (!tree) {
                return new _immutable_tree.Tree();
            } else {
                return tree;
            }
    }
}
//# sourceMappingURL=reducer.js.map
