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
const react_2 = require("react");
const classnames_1 = __importDefault(require("classnames"));
const inode = __importStar(require("@banyan/immutable-tree/lib/immutable_node"));
class TreeNode extends react_2.Component {
    render() {
        const { node, tree_context } = this.props;
        const { renderTitle } = tree_context;
        const handleClick = (e) => {
            if (e.target.tagName !== "A") {
                e.preventDefault();
                if (tree_context.onSelectNode) {
                    tree_context.onSelectNode(node);
                }
            }
        };
        const isFolder = inode.hasChildren(node);
        const isOpenFolder = isFolder && node.get("isOpen");
        const isSelected = node.get("isSelected");
        const liClasses = classnames_1.default({
            "banyan-common": true,
            "banyan-closed": isFolder && !node.get("isOpen"),
            "banyan-folder": isFolder,
            "banyan-selected": isSelected
        });
        return (react_1.default.createElement("li", { key: node.get("id"), className: liClasses, role: "presentation" },
            react_1.default.createElement("div", { className: "banyan-element banyan-common", onClick: handleClick, role: "presentation" },
                react_1.default.createElement(TreeTitle, { node: node, renderTitle: renderTitle }),
                isFolder ? (react_1.default.createElement(TreeButton, { node: node, onToggleNode: tree_context.onToggleNode })) : null),
            isOpenFolder ? (react_1.default.createElement(TreeFolder, { node: node, tree_context: tree_context })) : null));
    }
    shouldComponentUpdate(nextProps) {
        return nextProps.node !== this.props.node;
    }
}
const TreeFolder = ({ node, tree_context, setRootElement }) => {
    const isRoot = node.get("isRoot");
    const ulClasses = classnames_1.default({
        "banyan-common": true,
        "banyan-tree": isRoot
    });
    const role = isRoot ? "tree" : "node";
    const setRef = isRoot ? setRootElement : undefined;
    return (react_1.default.createElement("ul", { className: ulClasses, role: role, ref: setRef }, inode
        .getChildren(node)
        .map((child) => child && (react_1.default.createElement(TreeNode, { key: child.get("id"), node: child, tree_context: tree_context })))));
};
const TreeTitle = ({ node, renderTitle }) => {
    const titleClasses = classnames_1.default({
        "banyan-common": true,
        "banyan-title": true,
        "banyan-title-folder": inode.hasChildren(node)
    });
    const isSelected = node.get("isSelected");
    const nodeTitle = renderTitle(node);
    const tabindex = isSelected ? 0 : -1;
    const isOpen = node.get("isOpen");
    const focusElement = (el) => {
        if (el) {
            el.focus();
        }
    };
    const props = {
        className: titleClasses,
        tabIndex: tabindex,
        role: "treeitem",
        "aria-selected": isSelected,
        "aria-expanded": isOpen,
        ref: isSelected ? focusElement : undefined
    };
    // todo: aria-level
    return react_1.default.createElement("span", Object.assign({}, props), nodeTitle);
};
const TreeButton = ({ node, onToggleNode }) => {
    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onToggleNode) {
            onToggleNode(node);
        }
    };
    const button_classes = classnames_1.default({
        "banyan-common": true,
        "banyan-toggler": true,
        "banyan-closed": !node.get("isOpen")
    });
    const button_char = node.get("isOpen") ? "▼" : "►";
    const props = {
        className: button_classes,
        onClick: handleClick,
        role: "presentation",
        "aria-hidden": true,
        tabIndex: -1
    };
    return (react_1.default.createElement("a", Object.assign({ href: "#" }, props), button_char));
};
const defaultRenderTitle = (node) => node.get("name");
class BaseTreeComponent extends react_2.Component {
    constructor(props) {
        super(props);
        this.setRootElement = (element) => {
            this.rootElement = element;
        };
        this.plugins = props.plugins || [];
        this.connectPlugins();
    }
    render() {
        const { tree, onToggleNode, onSelectNode, renderTitle } = this.props;
        const tree_context = {
            onToggleNode,
            onSelectNode,
            renderTitle: renderTitle || defaultRenderTitle
        };
        const props = {
            node: tree.root,
            tree_context,
            setRootElement: this.setRootElement
        };
        return react_1.default.createElement(TreeFolder, Object.assign({}, props));
    }
    componentDidMount() {
        for (const plugin of this.plugins) {
            plugin.componentDidMount();
        }
    }
    componentWillUnmount() {
        for (const plugin of this.plugins) {
            plugin.componentWillUnmount();
        }
    }
    getElement() {
        return this.rootElement;
    }
    connectPlugins() {
        for (const plugin of this.plugins) {
            plugin.setTreeProxy(this);
        }
    }
}
exports.BaseTreeComponent = BaseTreeComponent;
//# sourceMappingURL=base_tree_component.js.map