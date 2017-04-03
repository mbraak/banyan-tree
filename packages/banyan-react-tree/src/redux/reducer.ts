import * as actions from "./actions";
import { Tree } from "../immutable_tree";

export const createReducerForTreeId = (tree_id: string) => (tree: Tree, action: any): Tree => {
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

export function reduceTree(tree: Tree, action: any): Tree {
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
