import React from "react";
import { BaseTreeComponent } from "../base_tree_component";
import * as actions from "./actions";
import { KeyboardPlugin } from "../keyboard_plugin";
const ReduxTree = ({ tree, dispatch, renderTitle, tree_id, keyboardSupport = true }) => {
    const handleSelect = (node) => {
        dispatch({
            type: actions.SELECT_NODE,
            node_id: node.get("id"),
            tree_id
        });
    };
    const handleToggle = (node) => {
        dispatch({
            type: actions.TOGGLE_NODE,
            node_id: node.get("id"),
            tree_id
        });
    };
    const handleKey = (key) => {
        dispatch({
            type: actions.HANDLE_KEY,
            key,
            tree_id
        });
        return true;
    };
    const plugins = keyboardSupport ? [new KeyboardPlugin(handleKey)] : [];
    const props = {
        tree,
        onToggleNode: handleToggle,
        onSelectNode: handleSelect,
        renderTitle,
        plugins
    };
    return React.createElement(BaseTreeComponent, Object.assign({}, props));
};
export default ReduxTree;

//# sourceMappingURL=component.js.map
