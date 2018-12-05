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
const react_1 = require("react");
const base_tree_component_1 = require("./base_tree_component");
const keyboard_plugin_1 = require("./keyboard_plugin");
class TreeComponent extends react_1.Component {
    constructor(props) {
        super(props);
        this.handleToggle = (node) => {
            const { tree } = this.state;
            this.setState({
                tree: tree.toggleNode(node.get("id"))
            });
        };
        this.handleSelect = (node) => {
            const { tree } = this.state;
            this.setState({
                tree: tree.selectNode(node.get("id"))
            });
        };
        this.handleKey = (key) => {
            const { tree } = this.state;
            const [isHandled, newTree] = tree.handleKey(key);
            if (!isHandled) {
                return false;
            }
            else {
                this.setState({ tree: newTree });
                return true;
            }
        };
        this.state = { tree: props.tree };
    }
    render() {
        const { tree } = this.state;
        const { renderTitle, keyboardSupport } = this.props;
        const createKeyboardPlugin = () => new keyboard_plugin_1.KeyboardPlugin(this.handleKey);
        const plugins = keyboardSupport ? [createKeyboardPlugin()] : [];
        const props = {
            tree,
            renderTitle,
            onToggleNode: this.handleToggle,
            onSelectNode: this.handleSelect,
            plugins
        };
        return React.createElement(base_tree_component_1.BaseTreeComponent, Object.assign({}, props));
    }
}
TreeComponent.defaultProps = {
    keyboardSupport: true
};
exports.TreeComponent = TreeComponent;
//# sourceMappingURL=tree_component.js.map