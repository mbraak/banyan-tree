"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = reduceTree;

var _actions = require("./actions");

var actions = _interopRequireWildcard(_actions);

var _immutable_tree = require("./immutable_tree");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function reduceTree(tree, action) {
    switch (action.type) {
        case actions.SELECT_NODE:
            return tree.selectNode(action.node_id);
        case actions.TOGGLE_NODE:
            return tree.toggleNode(action.node_id);
        default:
            if (!tree) {
                return new _immutable_tree.Tree();
            } else {
                return tree;
            }
    }
}
//# sourceMappingURL=reducer.js.map
