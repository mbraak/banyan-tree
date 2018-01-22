import React from "react";
import { BaseTreeComponent } from "./base_tree_component";
import { KeyboardPlugin } from "./keyboard_plugin";
export class TreeComponent extends React.Component {
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
        const createKeyboardPlugin = () => new KeyboardPlugin(this.handleKey);
        const plugins = keyboardSupport ? [createKeyboardPlugin()] : [];
        const props = {
            tree,
            renderTitle,
            onToggleNode: this.handleToggle,
            onSelectNode: this.handleSelect,
            plugins
        };
        return React.createElement(BaseTreeComponent, Object.assign({}, props));
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
//# sourceMappingURL=tree_component.js.map