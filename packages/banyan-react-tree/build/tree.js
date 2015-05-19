"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// change import for flow

var _classNames = require("classnames");

var _classNames2 = _interopRequireWildcard(_classNames);

var _TreeStore = require("./tree_store");

var _timeout = require("./utils");

var _Position = require("./position");

var _Tree = require("./tree_node.js");

/* @flow */
var React = require("react");

function isActiveElementAnInput() {
    var tag_name = document.activeElement && document.activeElement.tagName.toLowerCase();

    return tag_name === "input" || tag_name === "textarea" || tag_name === "select";
}

var TreeComponent = (function (_React$Component) {
    function TreeComponent(props) {
        _classCallCheck(this, TreeComponent);

        _get(Object.getPrototypeOf(TreeComponent.prototype), "constructor", this).call(this, props);

        this.state = { store: this.createStore() };
    }

    _inherits(TreeComponent, _React$Component);

    _createClass(TreeComponent, [{
        key: "createStore",
        value: function createStore() {
            return new _TreeStore.TreeStore({
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
    }, {
        key: "getTree",

        // - public functions
        value: function getTree() {
            return this.getStore().tree;
        }
    }, {
        key: "getStore",
        value: function getStore() {
            return this.state.store;
        }
    }, {
        key: "render",

        // - react functions
        value: function render() {
            var store = this.state.store;

            return React.createElement(TreeFolderComponent, { node: store.tree, store: store });
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            // todo: keyboard mixin?
            document.addEventListener("keydown", this.handleKeyDown.bind(this));
        }
    }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
            document.removeEventListener("keydown", this.handleKeyDown.bind(this));
        }
    }, {
        key: "handleKeyDown",

        // - event handlers
        value: function handleKeyDown(e) {
            if (!isActiveElementAnInput()) {
                this.getStore().handleKeyDown(e.keyIdentifier);
            }
        }
    }]);

    return TreeComponent;
})(React.Component);

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

var TreeFolderComponent = (function (_React$Component2) {
    function TreeFolderComponent() {
        _classCallCheck(this, TreeFolderComponent);

        if (_React$Component2 != null) {
            _React$Component2.apply(this, arguments);
        }
    }

    _inherits(TreeFolderComponent, _React$Component2);

    _createClass(TreeFolderComponent, [{
        key: "render",
        value: function render() {
            var folder = this.props.node;
            var store = this.props.store;

            var classes = _classNames2["default"]({
                banyan_common: true,
                "banyan-loading": folder.is_loading,
                "banyan-tree": !folder.parent
            });

            var children = [];

            folder.children.forEach(function (node) {
                if (store.isNodeHovered(node)) {
                    children.push(React.createElement(TreePlaceholderComponent, { key: "" + node.id + "-placeholder", node: node, store: store }));
                }

                if (!store.isNodeDragged(node)) {
                    children.push(React.createElement(TreeNodeComponent, { key: node.id, node: node, store: store }));
                }
            });

            return React.createElement(
                "ul",
                { className: classes },
                children
            );
        }
    }, {
        key: "shouldComponentUpdate",
        value: function shouldComponentUpdate() {
            return this.props.store.isNodeChanged(this.props.node);
        }
    }]);

    return TreeFolderComponent;
})(React.Component);

var TreeButtonComponent = (function (_React$Component3) {
    function TreeButtonComponent() {
        _classCallCheck(this, TreeButtonComponent);

        if (_React$Component3 != null) {
            _React$Component3.apply(this, arguments);
        }
    }

    _inherits(TreeButtonComponent, _React$Component3);

    _createClass(TreeButtonComponent, [{
        key: "render",
        value: function render() {
            var is_open = this.props.is_open;
            var open_text, classes;

            if (is_open) {
                open_text = "&#x25bc;";
                classes = "banyan-toggler banyan-closed banyan_common";
            } else {
                open_text = "&#x25ba;";
                classes = "banyan-toggler banyan_common";
            }

            return React.createElement("a", { href: "#", className: classes, dangerouslySetInnerHTML: { __html: open_text }, onClick: this.handleClick.bind(this) });
        }
    }, {
        key: "handleClick",
        value: function handleClick(e) {
            e.preventDefault();

            this.props.store.toggleNode(this.props.node);
        }
    }]);

    return TreeButtonComponent;
})(React.Component);

var TreeTitleComponent = (function (_React$Component4) {
    function TreeTitleComponent() {
        _classCallCheck(this, TreeTitleComponent);

        if (_React$Component4 != null) {
            _React$Component4.apply(this, arguments);
        }
    }

    _inherits(TreeTitleComponent, _React$Component4);

    _createClass(TreeTitleComponent, [{
        key: "render",
        value: function render() {
            var node = this.props.node;
            var classes = "banyan-title banyan_common";

            if (node.isFolder()) {
                classes += " banyan-title-folder";
            }

            var node_name = node.name;

            if (this.props.store.debug) {
                node.debug_draw_count = (node.debug_draw_count || 0) + 1;
                node_name += " " + node.debug_draw_count.toString();
            }

            return React.createElement(
                "span",
                { className: classes, onClick: this.handleClick.bind(this) },
                node_name
            );
        }
    }, {
        key: "handleClick",
        value: function handleClick(e) {
            e.preventDefault();

            var node = this.props.node;

            this.props.store.selectNode(node);
        }
    }]);

    return TreeTitleComponent;
})(React.Component);

var TreeNodeComponent = (function (_React$Component5) {
    function TreeNodeComponent() {
        _classCallCheck(this, TreeNodeComponent);

        if (_React$Component5 != null) {
            _React$Component5.apply(this, arguments);
        }
    }

    _inherits(TreeNodeComponent, _React$Component5);

    _createClass(TreeNodeComponent, [{
        key: "render",
        value: function render() {
            var node = this.props.node;
            var store = this.props.store;

            function getClasses() {
                return _classNames2["default"]({
                    "banyan-closed": !node.is_open,
                    banyan_common: true,
                    "banyan-dragged": store.isNodeDragged(node),
                    "banyan-folder": node.isFolder(),
                    "banyan-loading": node.is_loading,
                    "banyan-hover": store.isNodeHovered(node),
                    "banyan-selected": node.is_selected
                });
            }

            function getButtonElement() {
                if (node.isFolder()) {
                    return React.createElement(TreeButtonComponent, { node: node, is_open: node.is_open, store: store });
                } else {
                    return null;
                }
            }

            function getFolderElement() {
                if (node.isFolder() && node.is_open) {
                    return React.createElement(TreeFolderComponent, { node: node, store: store });
                } else {
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

            return React.createElement(
                "li",
                { className: getClasses() },
                React.createElement(
                    "div",
                    _extends({ className: "banyan-element banyan_common" }, mouse_props),
                    getButtonElement(),
                    React.createElement(TreeTitleComponent, { node: node, store: store })
                ),
                getFolderElement()
            );
        }
    }, {
        key: "handleMouseDown",
        value: function handleMouseDown(e) {
            var node = this.props.node;
            var store = this.props.store;

            var li_node = e.currentTarget.parentNode;

            var waiting_for_delay = true;
            var dragging_started = false;

            function handleMouseMove() {
                if (waiting_for_delay) {
                    return true;
                } else if (!dragging_started) {
                    dragging_started = true;
                    store.startDragging(node, li_node.clientHeight);
                }
            }

            function handleMouseUp() {
                if (store.dragging.hover_node) {
                    store.tree.moveNode(store.dragging.node, store.dragging.hover_node, _Position.Position.BEFORE);
                }

                store.stopDragging();

                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
            }

            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);

            _timeout.timeout(300).then(function () {
                waiting_for_delay = false;
            });

            e.preventDefault();
        }
    }, {
        key: "handleMouseEnter",
        value: function handleMouseEnter() {
            this.props.store.hoverNode(this.props.node);
        }
    }, {
        key: "shouldComponentUpdate",
        value: function shouldComponentUpdate() {
            return this.props.store.isNodeChanged(this.props.node);
        }
    }]);

    return TreeNodeComponent;
})(React.Component);

var TreePlaceholderComponent = (function (_React$Component6) {
    function TreePlaceholderComponent() {
        _classCallCheck(this, TreePlaceholderComponent);

        if (_React$Component6 != null) {
            _React$Component6.apply(this, arguments);
        }
    }

    _inherits(TreePlaceholderComponent, _React$Component6);

    _createClass(TreePlaceholderComponent, [{
        key: "render",
        value: function render() {
            var store = this.props.store;

            var style = {
                height: "" + store.dragging.placeholder_height + "px"
            };

            return React.createElement("li", { style: style, className: "banyan-placeholder banyan_common" });
        }
    }]);

    return TreePlaceholderComponent;
})(React.Component);