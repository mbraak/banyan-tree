"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_1 = require("./plugin");
class KeyboardPlugin extends plugin_1.Plugin {
    constructor(onHandleKey) {
        super();
        this.onHandleKey = onHandleKey;
        this.handleKey = this.handleKey.bind(this);
    }
    componentDidMount() {
        window.addEventListener("keydown", this.handleKey);
    }
    componentWillUnmount() {
        window.removeEventListener("keydown", this.handleKey);
    }
    handleKey(event) {
        const { key } = event;
        const onHandleKey = this.onHandleKey;
        if (this.canHandleKeyboard(key) && onHandleKey) {
            const is_handled = onHandleKey(key);
            if (is_handled) {
                event.preventDefault();
            }
        }
    }
    canHandleKeyboard(key) {
        return this.isArrowKey(key) && this.isFocusOnTree();
    }
    isArrowKey(key) {
        return (key === "ArrowUp" ||
            key === "ArrowDown" ||
            key === "ArrowLeft" ||
            key === "ArrowRight");
    }
    isFocusOnTree() {
        const active_element = document.activeElement;
        const tree_element = this.tree_proxy && this.tree_proxy.getElement();
        return (active_element != null &&
            tree_element != null &&
            isParentOf(tree_element, active_element));
    }
}
exports.KeyboardPlugin = KeyboardPlugin;
const isParentOf = (parent, child) => {
    let current_parent = child.parentElement;
    while (current_parent) {
        if (current_parent === parent) {
            return true;
        }
        current_parent = current_parent.parentElement;
    }
    return false;
};
//# sourceMappingURL=keyboard_plugin.js.map