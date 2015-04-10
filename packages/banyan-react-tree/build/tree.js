"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _React = require("react");

var _React2 = _interopRequireWildcard(_React);

var _TreeStore = require("./tree_store");

var _timeout$filterTrueKeys = require("./utils");

var _Position = require("./position");

function isActiveElementAnInput() {
    var tag_name = document.activeElement && document.activeElement.tagName.toLowerCase();

    return tag_name === "input" || tag_name === "textarea" || tag_name === "select";
}

var Tree = (function (_React$Component) {
    function Tree(props) {
        _classCallCheck(this, Tree);

        _get(Object.getPrototypeOf(Tree.prototype), "constructor", this).call(this, props);

        var store = new _TreeStore.TreeStore({
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

        this.state = { store: store };
    }

    _inherits(Tree, _React$Component);

    _createClass(Tree, [{
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

            return _React2["default"].createElement(TreeFolder, { node: store.tree, store: store });
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

    return Tree;
})(_React2["default"].Component);

exports["default"] = Tree;

Tree.defaultProps = {
    autoOpen: false,
    debug: false,
    dragAndDrop: false,
    keyboardSupport: true
};

Tree.propTypes = {
    autoOpen: _React2["default"].PropTypes.oneOfType([_React2["default"].PropTypes.bool, _React2["default"].PropTypes.number]),
    data: _React2["default"].PropTypes.array,
    debug: _React2["default"].PropTypes.bool,
    dragAndDrop: _React2["default"].PropTypes.bool,
    keyboardSupport: _React2["default"].PropTypes.bool,
    onError: _React2["default"].PropTypes.func,
    onInit: _React2["default"].PropTypes.func,
    saveState: _React2["default"].PropTypes.bool,
    url: _React2["default"].PropTypes.string
};

var TreeFolder = (function (_React$Component2) {
    function TreeFolder() {
        _classCallCheck(this, TreeFolder);

        if (_React$Component2 != null) {
            _React$Component2.apply(this, arguments);
        }
    }

    _inherits(TreeFolder, _React$Component2);

    _createClass(TreeFolder, [{
        key: "render",
        value: function render() {
            var folder = this.props.node;
            var store = this.props.store;

            var classes = _timeout$filterTrueKeys.filterTrueKeys({
                banyan_common: true,
                "banyan-loading": folder.is_loading,
                "banyan-tree": !folder.parent

            }).join(" ");

            var children = [];

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = folder.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var node = _step.value;

                    if (store.isNodeHovered(node)) {
                        children.push(_React2["default"].createElement(TreePlaceholder, { key: "" + node.id + "-placeholder", node: node, store: store }));
                    }

                    if (!store.isNodeDragged(node)) {
                        children.push(_React2["default"].createElement(TreeNode, { key: node.id, node: node, store: store }));
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator["return"]) {
                        _iterator["return"]();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return _React2["default"].createElement(
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

    return TreeFolder;
})(_React2["default"].Component);

var TreeButton = (function (_React$Component3) {
    function TreeButton() {
        _classCallCheck(this, TreeButton);

        if (_React$Component3 != null) {
            _React$Component3.apply(this, arguments);
        }
    }

    _inherits(TreeButton, _React$Component3);

    _createClass(TreeButton, [{
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

            return _React2["default"].createElement("a", { href: "#", className: classes, dangerouslySetInnerHTML: { __html: open_text }, onClick: this.handleClick.bind(this) });
        }
    }, {
        key: "handleClick",
        value: function handleClick(e) {
            e.preventDefault();

            this.props.store.toggleNode(this.props.node);
        }
    }]);

    return TreeButton;
})(_React2["default"].Component);

var TreeTitle = (function (_React$Component4) {
    function TreeTitle() {
        _classCallCheck(this, TreeTitle);

        if (_React$Component4 != null) {
            _React$Component4.apply(this, arguments);
        }
    }

    _inherits(TreeTitle, _React$Component4);

    _createClass(TreeTitle, [{
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

            return _React2["default"].createElement(
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

    return TreeTitle;
})(_React2["default"].Component);

var TreeNode = (function (_React$Component5) {
    function TreeNode() {
        _classCallCheck(this, TreeNode);

        if (_React$Component5 != null) {
            _React$Component5.apply(this, arguments);
        }
    }

    _inherits(TreeNode, _React$Component5);

    _createClass(TreeNode, [{
        key: "render",
        value: function render() {
            var node = this.props.node;
            var store = this.props.store;

            function getClasses() {
                return _timeout$filterTrueKeys.filterTrueKeys({
                    "banyan-closed": !node.is_open,
                    banyan_common: true,
                    "banyan-dragged": store.isNodeDragged(node),
                    "banyan-folder": node.isFolder(),
                    "banyan-loading": node.is_loading,
                    "banyan-hover": store.isNodeHovered(node),
                    "banyan-selected": node.is_selected
                }).join(" ");
            }

            function getButtonElement() {
                if (node.isFolder()) {
                    return _React2["default"].createElement(TreeButton, { node: node, is_open: node.is_open, store: store });
                } else {
                    return null;
                }
            }

            function getFolderElement() {
                if (node.isFolder() && node.is_open) {
                    return _React2["default"].createElement(TreeFolder, { node: node, store: store });
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

            return _React2["default"].createElement(
                "li",
                { className: getClasses() },
                _React2["default"].createElement(
                    "div",
                    _extends({ className: "banyan-element banyan_common" }, mouse_props),
                    getButtonElement(),
                    _React2["default"].createElement(TreeTitle, { node: node, store: store })
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

            _timeout$filterTrueKeys.timeout(300).then(function () {
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

    return TreeNode;
})(_React2["default"].Component);

var TreePlaceholder = (function (_React$Component6) {
    function TreePlaceholder() {
        _classCallCheck(this, TreePlaceholder);

        if (_React$Component6 != null) {
            _React$Component6.apply(this, arguments);
        }
    }

    _inherits(TreePlaceholder, _React$Component6);

    _createClass(TreePlaceholder, [{
        key: "render",
        value: function render() {
            var store = this.props.store;

            var style = {
                height: "" + store.dragging.placeholder_height + "px"
            };

            return _React2["default"].createElement("li", { style: style, className: "banyan-placeholder banyan_common" });
        }
    }]);

    return TreePlaceholder;
})(_React2["default"].Component);

module.exports = exports["default"];