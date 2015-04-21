/* @flow */
var React = require("react");  // change import for flow

import {TreeStore} from "./tree_store";
import {timeout, filterTrueKeys} from "./utils";
import {Position} from "./position";


function isActiveElementAnInput(): boolean {
    var tag_name = document.activeElement && document.activeElement.tagName.toLowerCase();

    return (tag_name === "input" || tag_name === "textarea" || tag_name === "select");
}


class Tree extends React.Component {
    constructor(props) {
        super(props);

        var store = new TreeStore({
            data: this.props.data,
            url: this.props.url,
            auto_open: this.props.autoOpen,
            debug: this.props.debug,
            drag_and_drop: this.props.dragAndDrop,
            save_state: this.props.saveState,
            keyboard_support: this.props.keyboardSupport,
            on_change: this.forceUpdate.bind(this),
            on_init: this.props.onInit,
            on_error: this.props.onError
        });

        this.state = {store: store};
    }

    // - public functions
    getTree() {
        return this.getStore().tree;
    }

    getStore() {
        return this.state.store;
    }

    // - react functions
    render() {
        var store = this.state.store;

        return (
            <TreeFolder node={store.tree} store={store}></TreeFolder>
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
    handleKeyDown(e) {
        if (!isActiveElementAnInput()) {
            this.getStore().handleKeyDown(e.keyIdentifier);
        }
    }
}

Tree.defaultProps = {
    autoOpen: false,
    debug: false,
    dragAndDrop: false,
    keyboardSupport: true
};

Tree.propTypes = {
    autoOpen: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.number]),
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
module.exports = Tree;


class TreeFolder extends React.Component {
    render() {
        var folder = this.props.node;
        var store = this.props.store;

        var classes = filterTrueKeys({
            "banyan_common": true,
            "banyan-loading": folder.is_loading,
            "banyan-tree": !folder.parent

        }).join(" ");

        var children = [];

        folder.children.forEach((node) => {
            if (store.isNodeHovered(node)) {
                children.push(<TreePlaceholder key={`${node.id}-placeholder`} node={node} store={store}></TreePlaceholder>);
            }

            if (!store.isNodeDragged(node)) {
                children.push(<TreeNode key={node.id} node={node} store={store}></TreeNode>);
            }
        });

        return <ul className={classes}>{children}</ul>;
    }

    shouldComponentUpdate() {
        return this.props.store.isNodeChanged(this.props.node);
    }
 }


class TreeButton extends React.Component {
    render() {
        var is_open = this.props.is_open;
        var open_text, classes;

        if (is_open) {
            open_text = "&#x25bc;";
            classes = "banyan-toggler banyan-closed banyan_common";
        }
        else {
            open_text = "&#x25ba;";
            classes = "banyan-toggler banyan_common";
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


class TreeTitle extends React.Component {
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


class TreeNode extends React.Component {
    render() {
        var node = this.props.node;
        var store = this.props.store;

        function getClasses() {
            return filterTrueKeys({
                "banyan-closed": !node.is_open,
                "banyan_common": true,
                "banyan-dragged": store.isNodeDragged(node),
                "banyan-folder": node.isFolder(),
                "banyan-loading": node.is_loading,
                "banyan-hover": store.isNodeHovered(node),
                "banyan-selected": node.is_selected
            }).join(" ");
        }

        function getButtonElement() {
            if (node.isFolder()) {
                return <TreeButton node={node} is_open={node.is_open} store={store}></TreeButton>;
            }
            else {
                return null;
            }
        }

        function getFolderElement() {
            if (node.isFolder() && node.is_open) {
                return <TreeFolder node={node} store={store}></TreeFolder>;
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
                    <TreeTitle node={node} store={store}></TreeTitle>
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


class TreePlaceholder extends React.Component {
    render() {
        var store = this.props.store;

        var style = {
            height: `${store.dragging.placeholder_height}px`
        };

        return <li style={style} className="banyan-placeholder banyan_common"></li>;
    }
}
