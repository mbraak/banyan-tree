"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const base_tree_component_1 = require("banyan-react-tree/lib/base_tree_component");
const actions = __importStar(require("./actions"));
const keyboard_plugin_1 = require("banyan-react-tree/lib/keyboard_plugin");
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
    const plugins = keyboardSupport ? [new keyboard_plugin_1.KeyboardPlugin(handleKey)] : [];
    const props = {
        tree,
        onToggleNode: handleToggle,
        onSelectNode: handleSelect,
        renderTitle,
        plugins
    };
    return react_1.default.createElement(base_tree_component_1.BaseTreeComponent, Object.assign({}, props));
};
exports.default = ReduxTree;
//# sourceMappingURL=component.js.map