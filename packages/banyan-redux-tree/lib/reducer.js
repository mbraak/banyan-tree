"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_tree_1 = require("banyan-immutable-tree/lib/immutable_tree");
const actions = __importStar(require("./actions"));
exports.createReducerForTreeId = (tree_id) => (tree, action) => {
    if (tree_id !== action.tree_id) {
        if (!tree) {
            return new immutable_tree_1.Tree();
        }
        else {
            return tree;
        }
    }
    else {
        return reduceTree(tree, action);
    }
};
function reduceTree(tree, action) {
    switch (action.type) {
        case actions.SELECT_NODE:
            return tree.selectNode(action.node_id);
        case actions.TOGGLE_NODE:
            return tree.toggleNode(action.node_id);
        case actions.HANDLE_KEY:
            const [, new_tree] = tree.handleKey(action.key);
            return new_tree;
        default:
            if (!tree) {
                return new immutable_tree_1.Tree();
            }
            else {
                return tree;
            }
    }
}
exports.reduceTree = reduceTree;
//# sourceMappingURL=reducer.js.map