"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_1 = require("./plugin");
class KeyboardPlugin extends plugin_1.Plugin {
    constructor(onHandleKey) {
        super();
        this.handleKey = (event) => {
            const { key } = event;
            const onHandleKey = this.onHandleKey;
            if (this.canHandleKeyboard(key) && onHandleKey) {
                const isHandled = onHandleKey(key);
                if (isHandled) {
                    event.preventDefault();
                }
            }
        };
        this.onHandleKey = onHandleKey;
    }
    componentDidMount() {
        window.addEventListener("keydown", this.handleKey);
    }
    componentWillUnmount() {
        window.removeEventListener("keydown", this.handleKey);
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
        const activeElement = document.activeElement;
        const treeElement = this.tree_proxy && this.tree_proxy.getElement();
        return (activeElement != null &&
            treeElement != null &&
            isParentOf(treeElement, activeElement));
    }
}
exports.KeyboardPlugin = KeyboardPlugin;
const isParentOf = (parent, child) => {
    let currentParent = child.parentElement;
    while (currentParent) {
        if (currentParent === parent) {
            return true;
        }
        currentParent = currentParent.parentElement;
    }
    return false;
};
//# sourceMappingURL=keyboard_plugin.js.map