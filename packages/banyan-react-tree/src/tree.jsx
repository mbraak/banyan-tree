/* @flow */
var React = require("react");  // change import for flow

import classNames from "classnames";

import {TreeStore} from "./tree_store";
import {timeout} from "./utils";
import {Position} from "./position";
import {Tree} from "./tree_node.js";


function isActiveElementAnInput(): boolean {
    var tag_name = document.activeElement && document.activeElement.tagName.toLowerCase();

    return (tag_name === "input" || tag_name === "textarea" || tag_name === "select");
}


class TreeComponent extends React.Component {
    constructor(props: Object) {
        super(props);

        this.state = {store: this.createStore()};
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
        var store = this.state.store;

        return (
            <TreeFolderComponent node={store.tree} store={store}></TreeFolderComponent>
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

TreeComponent.defaultProps = {
    autoOpen: false,
    debug: false,
    dragAndDrop: false,
    keyboardSupport: true
};

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


// Use exports to satisfy flow
module.exports = TreeComponent;


class TreeFolderComponent extends React.Component {
    render() {
        var folder = this.props.node;
        var store = this.props.store;

        var classes = classNames({
            "banyan_common": true,
            "banyan-loading": folder.is_loading,
            "banyan-tree": !folder.parent
        });

        var children = [];

        folder.children.forEach((node) => {
            if (store.isNodeHovered(node)) {
                children.push(
                    <TreePlaceholderComponent key={`${node.id}-placeholder`} node={node} store={store}></TreePlaceholderComponent>
                );
            }

            if (!store.isNodeDragged(node)) {
                children.push(
                    <TreeNodeComponent key={node.id} node={node} store={store}></TreeNodeComponent>
                );
            }
        });

        return <ul className={classes}>{children}</ul>;
    }

    shouldComponentUpdate() {
        return this.props.store.isNodeChanged(this.props.node);
    }
 }


class TreeButtonComponent extends React.Component {
    render() {
        var is_open = this.props.is_open;
        var open_text, classes;

        if (is_open) {
            open_text = "&#x25bc;";
            classes = "banyan-toggler banyan_common";
        }
        else {
            open_text = "&#x25ba;";
            classes = "banyan-toggler banyan-closed banyan_common";
        }

        return (
            <a href="#" className={classes} dangerouslySetInnerHTML={{__html: open_text}} onClick={this.handleClick.bind(this)}></a>
        );
    }

    handleClick(e) {
        e.preventDefault();

        this.props.store.toggleNode(this.props.node);
    }
}


class TreeTitleComponent extends React.Component {
    render() {
        var node = this.props.node;
        var classes = "banyan-title banyan_common";

        if (node.isFolder()) {
            classes += " banyan-title-folder";
        }

        var node_name = node.name;

        if (this.props.store.debug) {
            node.debug_draw_count = (node.debug_draw_count || 0) + 1;
            node_name += ` ${node.debug_draw_count.toString()}`;
        }

        return (
            <span className={classes} onClick={this.handleClick.bind(this)}>
                {node_name}
            </span>
        );
    }

    handleClick(e) {
        e.preventDefault();

        var node = this.props.node;

        this.props.store.selectNode(node);
    }
}


class TreeNodeComponent extends React.Component {
    render() {
        var node = this.props.node;
        var store = this.props.store;

        function getClasses() {
            return classNames({
                "banyan-closed": !node.is_open,
                "banyan_common": true,
                "banyan-dragged": store.isNodeDragged(node),
                "banyan-folder": node.isFolder(),
                "banyan-loading": node.is_loading,
                "banyan-hover": store.isNodeHovered(node),
                "banyan-selected": node.is_selected
            });
        }

        function getButtonElement() {
            if (node.isFolder()) {
                return <TreeButtonComponent node={node} is_open={node.is_open} store={store}></TreeButtonComponent>;
            }
            else {
                return null;
            }
        }

        function getFolderElement() {
            if (node.isFolder() && node.is_open) {
                return <TreeFolderComponent node={node} store={store}></TreeFolderComponent>;
            }
            else {
                return null;
            }
        }

        var mouse_props = {};

        if (store.drag_and_drop) {
            mouse_props.onMouseDown = this.handleMouseDown.bind(this);

            if (store.dragging.node) {
                mouse_props.onMouseEnter = this.handleMouseEnter.bind(this);
            }
        }

        return (
            <li className={getClasses()}>
                <div className="banyan-element banyan_common" {...mouse_props}>
                    {getButtonElement()}
                    <TreeTitleComponent node={node} store={store}></TreeTitleComponent>
                </div>
                {getFolderElement()}
            </li>
        );
    }

    handleMouseDown(e) {
        var node = this.props.node;
        var store = this.props.store;

        var li_node = e.currentTarget.parentNode;

        var waiting_for_delay = true;
        var dragging_started = false;

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
}


class TreePlaceholderComponent extends React.Component {
    render() {
        var store = this.props.store;

        var style = {
            height: `${store.dragging.placeholder_height}px`
        };

        return <li style={style} className="banyan-placeholder banyan_common"></li>;
    }
}
