"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const base_tree_component_1 = require("./base_tree_component");
const keyboard_plugin_1 = require("./keyboard_plugin");
class TreeComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { tree: props.tree };
        this.handleToggle = this.handleToggle.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleKey = this.handleKey.bind(this);
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
    handleToggle(node) {
        const { tree } = this.state;
        this.setState({
            tree: tree.toggleNode(node.get("id"))
        });
    }
    handleSelect(node) {
        const { tree } = this.state;
        this.setState({
            tree: tree.selectNode(node.get("id"))
        });
    }
    handleKey(key) {
        const { tree } = this.state;
        const [is_handled, new_tree] = tree.handleKey(key);
        if (!is_handled) {
            return false;
        }
        else {
            this.setState({ tree: new_tree });
            return true;
        }
    }
}
TreeComponent.defaultProps = {
    keyboardSupport: true
};
exports.TreeComponent = TreeComponent;
//# sourceMappingURL=tree_component.js.map