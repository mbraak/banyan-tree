"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const mobx_react_1 = require("mobx-react");
const base_tree_component_1 = require("@banyan/react-tree/lib/base_tree_component");
const keyboard_plugin_1 = require("@banyan/react-tree/lib/keyboard_plugin");
const MobxTree = ({ tree_store, renderTitle, keyboardSupport = true }) => {
    const select = tree_store.select.bind(tree_store);
    const toggle = tree_store.toggle.bind(tree_store);
    const handleKey = tree_store.handleKey.bind(tree_store);
    const plugins = keyboardSupport ? [new keyboard_plugin_1.KeyboardPlugin(handleKey)] : [];
    const props = {
        tree: tree_store.tree,
        renderTitle,
        onSelectNode: select,
        onToggleNode: toggle,
        plugins
    };
    return React.createElement(base_tree_component_1.BaseTreeComponent, Object.assign({}, props));
};
exports.default = mobx_react_1.observer(MobxTree);
//# sourceMappingURL=component.js.map