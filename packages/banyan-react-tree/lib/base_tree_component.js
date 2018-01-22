import React from "react";
import classNames from "classnames";
import * as inode from "banyan-immutable-tree/lib/immutable_node";
class TreeNode extends React.Component {
    render() {
        const { node, tree_context } = this.props;
        const { renderTitle } = tree_context;
        function handleClick(e) {
            if (e.target.tagName !== "A") {
                e.preventDefault();
                if (tree_context.onSelectNode) {
                    tree_context.onSelectNode(node);
                }
            }
        }
        const is_folder = inode.hasChildren(node);
        const is_open_folder = is_folder && node.get("is_open");
        const is_selected = node.get("is_selected");
        const li_classes = classNames({
            "banyan-common": true,
            "banyan-closed": is_folder && !node.get("is_open"),
            "banyan-folder": is_folder,
            "banyan-selected": is_selected
        });
        return (React.createElement("li", { key: node.get("id"), className: li_classes, role: "presentation" },
            React.createElement("div", { className: "banyan-element banyan-common", onClick: handleClick, role: "presentation" },
                React.createElement(TreeTitle, { node: node, renderTitle: renderTitle }),
                is_folder ? (React.createElement(TreeButton, { node: node, onToggleNode: tree_context.onToggleNode })) : null),
            is_open_folder ? (React.createElement(TreeFolder, { node: node, tree_context: tree_context })) : null));
    }
    shouldComponentUpdate(nextProps) {
        return nextProps.node !== this.props.node;
    }
}
function TreeFolder({ node, tree_context, setRootElement }) {
    const is_root = node.get("is_root");
    const ul_classes = classNames({
        "banyan-common": true,
        "banyan-tree": is_root
    });
    const role = is_root ? "tree" : "node";
    const setRef = is_root ? setRootElement : undefined;
    return (React.createElement("ul", { className: ul_classes, role: role, ref: setRef }, inode
        .getChildren(node)
        .map((child) => child && (React.createElement(TreeNode, { key: child.get("id"), node: child, tree_context: tree_context })))));
}
function TreeTitle({ node, renderTitle }) {
    const title_classes = classNames({
        "banyan-common": true,
        "banyan-title": true,
        "banyan-title-folder": inode.hasChildren(node)
    });
    const is_selected = node.get("is_selected");
    const node_title = renderTitle(node);
    const tabindex = is_selected ? 0 : -1;
    const is_open = node.get("is_open");
    const focusElement = (el) => {
        if (el) {
            el.focus();
        }
    };
    const props = {
        className: title_classes,
        tabIndex: tabindex,
        role: "treeitem",
        "aria-selected": is_selected,
        "aria-expanded": is_open,
        ref: is_selected ? focusElement : undefined
    };
    // todo: aria-level
    return React.createElement("span", Object.assign({}, props), node_title);
}
function TreeButton({ node, onToggleNode }) {
    function handleClick(e) {
        e.preventDefault();
        e.stopPropagation();
        if (onToggleNode) {
            onToggleNode(node);
        }
    }
    const button_classes = classNames({
        "banyan-common": true,
        "banyan-toggler": true,
        "banyan-closed": !node.get("is_open")
    });
    const button_char = node.get("is_open") ? "▼" : "►";
    const props = {
        className: button_classes,
        onClick: handleClick,
        role: "presentation",
        "aria-hidden": true,
        tabIndex: -1
    };
    return (React.createElement("a", Object.assign({ href: "#" }, props), button_char));
}
const defaultRenderTitle = (node) => node.get("name");
export class BaseTreeComponent extends React.Component {
    constructor(props) {
        super(props);
        this.setRootElement = this.setRootElement.bind(this);
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
        return React.createElement(TreeFolder, Object.assign({}, props));
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
        return this.root_element;
    }
    setRootElement(element) {
        this.root_element = element;
    }
    connectPlugins() {
        for (const plugin of this.plugins) {
            plugin.setTreeProxy(this);
        }
    }
}
//# sourceMappingURL=base_tree_component.js.map