import * as actions from "./actions";
import { Tree } from "../immutable_tree";

export default function reduceTree(tree: Tree, action: any) {
    switch (action.type) {
        case actions.SELECT_NODE:
            return tree.selectNode(action.node_id);

        case actions.TOGGLE_NODE:
            return tree.toggleNode(action.node_id);

        default:
            if (!tree) {
                return new Tree();
            }
            else {
                return tree;
            }
    }
}
