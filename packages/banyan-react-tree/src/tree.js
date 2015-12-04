/* @flow */
import React from "react";

import classNames from "classnames";

import { TreeStore } from "./tree_store";
import { timeout } from "./utils";
import { Position } from "./position";
import { Tree } from "./tree_node.js";


function isActiveElementAnInput(): boolean {
    const tag_name = document.activeElement && document.activeElement.tagName.toLowerCase();

    return (tag_name === "input" || tag_name === "textarea" || tag_name === "select");
}


export default class TreeComponent extends React.Component {
    constructor(props: Object) {
        super(props);

        this.state = { store: this.createStore() };
    }

    createStore() {
        return new TreeStore({
            data: this.props.data,
            url: this.props.url,
            auto_open: this.props.autoOpen,
            controller: this.props.controller,
            debug: this.props.debug,
            drag_and_drop: this.props.dragAndDrop,
            save_state: this.props.saveState,
            keyboard_support: this.props.keyboardSupport,
            on_change: this.forceUpdate.bind(this),
            on_init: this.props.onInit,
            on_error: this.props.onError
        });
    }

    // - public functions
    getTree(): Tree {
        return this.getStore().tree;
    }

    getStore(): TreeStore {
        return this.state.store;
    }

    // - react functions
    render() {
        const store = this.state.store;

        return (
            <TreeFolderComponent node={store.tree} store={store} />
        );
    }

    componentDidMount() {
        // todo: keyboard mixin?
        document.addEventListener("keydown", this.handleKeyDown.bind(this));
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyDown.bind(this));
    }

    // - event handlers
    handleKeyDown(e: any) {
        if (!isActiveElementAnInput()) {
            this.getStore().handleKeyDown(e.keyIdentifier);
        }
    }
}

TreeComponent.propTypes = {
    autoOpen: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.number]),
    controller: React.PropTypes.object,
    data: React.PropTypes.array,
    debug: React.PropTypes.bool,
    dragAndDrop: React.PropTypes.bool,
    keyboardSupport: React.PropTypes.bool,
    onError: React.PropTypes.func,
    onInit: React.PropTypes.func,
    saveState: React.PropTypes.bool,
    url: React.PropTypes.string
};

TreeComponent.defaultProps = {
    autoOpen: false,
    debug: false,
    dragAndDrop: false,
    keyboardSupport: true
};


class TreeFolderComponent extends React.Component {
    render() {
        const folder = this.props.node;
        const store = this.props.store;

        const classes = classNames({
            "banyan-common": true,
            "banyan-loading": folder.is_loading,
            "banyan-tree": !folder.parent
        });

        function getRole() {
            if (!folder.parent) {
                return "tree";
            }
            else {
                return "group";
            }
        }

        const children = [];

        folder.children.forEach((node) => {
            if (store.isNodeHovered(node)) {
                children.push(
                    <TreePlaceholderComponent key={`${node.id}-placeholder`} node={node} store={store} />
                );
            }

            if (!store.isNodeDragged(node)) {
                children.push(
                    <TreeNodeComponent key={node.id} node={node} store={store} />
                );
            }
        });

        return <ul className={classes} role={getRole()}>{children}</ul>;
    }

    shouldComponentUpdate() {
        return this.props.store.isNodeChanged(this.props.node);
    }
}

TreeFolderComponent.propTypes = {
    node: React.PropTypes.object,
    store: React.PropTypes.object
};


class TreeButtonComponent extends React.Component {
    render() {
        const is_open = this.props.is_open;
        let open_text, classes;

        if (is_open) {
            open_text = "&#x25bc;";
            classes = "banyan-toggler banyan-common";
        }
        else {
            open_text = "&#x25ba;";
            classes = "banyan-toggler banyan-closed banyan-common";
        }

        return (
            <a
                href="#"
                className={classes}
                role="presentation"
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: open_text }}
                onClick={this.handleClick.bind(this)}
            />
        );
    }

    handleClick(e) {
        e.preventDefault();

        this.props.store.toggleNode(this.props.node);
    }
}

TreeButtonComponent.propTypes = {
    is_open: React.PropTypes.bool,
    node: React.PropTypes.object,
    store: React.PropTypes.object
};


class TreeTitleComponent extends React.Component {
    render() {
        const node = this.props.node;
        let classes = "banyan-title banyan-common";

        if (node.isFolder()) {
            classes += " banyan-title-folder";
        }

        const aria_props = {
            "role": "treeitem",
            "aria-selected": node.is_selected,
            "aria-expanded": node.isFolder() && node.is_open
        };

        let node_name = node.name;

        if (this.props.store.debug) {
            node.debug_draw_count = (node.debug_draw_count || 0) + 1;
            node_name += ` ${node.debug_draw_count.toString()}`;
        }

        return (
            <span className={classes} {...aria_props}>
                {node_name}
            </span>
        );
    }
}

TreeTitleComponent.propTypes = {
    node: React.PropTypes.object,
    store: React.PropTypes.object
};


class TreeNodeComponent extends React.Component {
    render() {
        const node = this.props.node;
        const store = this.props.store;

        function getClasses() {
            return classNames({
                "banyan-closed": !node.is_open,
                "banyan-common": true,
                "banyan-dragged": store.isNodeDragged(node),
                "banyan-folder": node.isFolder(),
                "banyan-loading": node.is_loading,
                "banyan-hover": store.isNodeHovered(node),
                "banyan-selected": node.is_selected
            });
        }

        function getButtonElement() {
            if (node.isFolder()) {
                return <TreeButtonComponent node={node} is_open={node.is_open} store={store} />;
            }
            else {
                return null;
            }
        }

        function getFolderElement() {
            if (node.isFolder() && node.is_open) {
                return <TreeFolderComponent node={node} store={store} />;
            }
            else {
                return null;
            }
        }

        const mouse_props = {};

        if (store.drag_and_drop) {
            mouse_props.onMouseDown = this.handleMouseDown.bind(this);

            if (store.dragging.node) {
                mouse_props.onMouseEnter = this.handleMouseEnter.bind(this);
            }
        }

        // todo: use ::this.handleClick when flow supports it
        return (
            <li className={getClasses()} role="presentation">
                <div className="banyan-element banyan-common" role="presentation" {...mouse_props} onClick={this.handleClick.bind(this)}>
                    <TreeTitleComponent node={node} store={store} />
                    {getButtonElement()}
                </div>
                {getFolderElement()}
            </li>
        );
    }

    handleMouseDown(e) {
        const node = this.props.node;
        const store = this.props.store;

        const li_node = e.currentTarget.parentNode;

        let waiting_for_delay = true;
        let dragging_started = false;

        function handleMouseMove() {
            if (waiting_for_delay) {
                return true;
            }
            else if (!dragging_started) {
                dragging_started = true;
                store.startDragging(node, li_node.clientHeight);
            }
        }

        function handleMouseUp() {
            if (store.dragging.hover_node) {
                store.tree.moveNode(
                    store.dragging.node,
                    store.dragging.hover_node,
                    Position.BEFORE
                );
            }

            store.stopDragging();

            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        }

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        timeout(300).then(() => {
            waiting_for_delay = false;
        });

        e.preventDefault();
    }

    handleMouseEnter() {
        this.props.store.hoverNode(this.props.node);
    }

    shouldComponentUpdate() {
        return this.props.store.isNodeChanged(this.props.node);
    }

    handleClick(e) {
        e.preventDefault();

        const node = this.props.node;

        this.props.store.selectNode(node);
    }
}

TreeNodeComponent.propTypes = {
    node: React.PropTypes.object,
    store: React.PropTypes.object
};


class TreePlaceholderComponent extends React.Component {
    render() {
        const store = this.props.store;

        const style = {
            height: `${store.dragging.placeholder_height}px`
        };

        return <li style={style} className="banyan-placeholder banyan-common"></li>;
    }
}

TreePlaceholderComponent.propTypes = {
    controller: React.PropTypes.object,
    store: React.PropTypes.object
};
