import { Tree } from "banyan-immutable-tree/lib/immutable_tree";
import * as actions from "./actions";
export const createReducerForTreeId = (tree_id) => (tree, action) => {
    if (tree_id !== action.tree_id) {
        if (!tree) {
            return new Tree();
        }
        else {
            return tree;
        }
    }
    else {
        return reduceTree(tree, action);
    }
};
export function reduceTree(tree, action) {
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
                return new Tree();
            }
            else {
                return tree;
            }
    }
}

//# sourceMappingURL=reducer.js.map
