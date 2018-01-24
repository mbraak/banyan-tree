import React from "react";
import { observer } from "mobx-react";
import { BaseTreeComponent } from "banyan-react-tree/lib/base_tree_component";
import { KeyboardPlugin } from "banyan-react-tree/lib/keyboard_plugin";
const MobxTree = ({ tree_store, renderTitle, keyboardSupport = true }) => {
    const select = tree_store.select.bind(tree_store);
    const toggle = tree_store.toggle.bind(tree_store);
    const handleKey = tree_store.handleKey.bind(tree_store);
    const plugins = keyboardSupport ? [new KeyboardPlugin(handleKey)] : [];
    const props = {
        tree: tree_store.tree,
        renderTitle,
        onSelectNode: select,
        onToggleNode: toggle,
        plugins
    };
    return React.createElement(BaseTreeComponent, Object.assign({}, props));
};
export default observer(MobxTree);
//# sourceMappingURL=component.js.map