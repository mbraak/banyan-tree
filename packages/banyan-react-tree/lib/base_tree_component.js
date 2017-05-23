"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BaseTreeComponent = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _immutable_node = require("banyan-immutable-tree/lib/immutable_node");

var inode = _interopRequireWildcard(_immutable_node);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TreeNode = function (_React$Component) {
    _inherits(TreeNode, _React$Component);

    function TreeNode() {
        _classCallCheck(this, TreeNode);

        return _possibleConstructorReturn(this, (TreeNode.__proto__ || Object.getPrototypeOf(TreeNode)).apply(this, arguments));
    }

    _createClass(TreeNode, [{
        key: "render",
        value: function render() {
            var _props = this.props,
                node = _props.node,
                tree_context = _props.tree_context;
            var renderTitle = tree_context.renderTitle;

            function handleClick(e) {
                if (e.target.tagName !== "A") {
                    e.preventDefault();
                    if (tree_context.onSelectNode) {
                        tree_context.onSelectNode(node);
                    }
                }
            }
            var is_folder = inode.hasChildren(node);
            var is_open_folder = is_folder && node.get("is_open");
            var is_selected = node.get("is_selected");
            var li_classes = (0, _classnames2.default)({
                "banyan-common": true,
                "banyan-closed": is_folder && !node.get("is_open"),
                "banyan-folder": is_folder,
                "banyan-selected": is_selected
            });
            return _react2.default.createElement("li", { key: node.get("id"), className: li_classes, role: "presentation" }, _react2.default.createElement("div", { className: "banyan-element banyan-common", onClick: handleClick, role: "presentation" }, _react2.default.createElement(TreeTitle, { node: node, renderTitle: renderTitle }), is_folder ? _react2.default.createElement(TreeButton, { node: node, onToggleNode: tree_context.onToggleNode }) : null), is_open_folder ? _react2.default.createElement(TreeFolder, { node: node, tree_context: tree_context }) : null);
        }
    }, {
        key: "shouldComponentUpdate",
        value: function shouldComponentUpdate(nextProps) {
            return nextProps.node !== this.props.node;
        }
    }]);

    return TreeNode;
}(_react2.default.Component);

function TreeFolder(_ref) {
    var node = _ref.node,
        tree_context = _ref.tree_context,
        setRootElement = _ref.setRootElement;

    var is_root = node.get("is_root");
    var ul_classes = (0, _classnames2.default)({
        "banyan-common": true,
        "banyan-tree": is_root
    });
    var role = is_root ? "tree" : "node";
    var setRef = is_root ? setRootElement : undefined;
    return _react2.default.createElement("ul", { className: ul_classes, role: role, ref: setRef }, inode.getChildren(node).map(function (child) {
        return _react2.default.createElement(TreeNode, { key: child.get("id"), node: child, tree_context: tree_context });
    }));
}
function TreeTitle(_ref2) {
    var node = _ref2.node,
        renderTitle = _ref2.renderTitle;

    var title_classes = (0, _classnames2.default)({
        "banyan-common": true,
        "banyan-title": true,
        "banyan-title-folder": inode.hasChildren(node)
    });
    var is_selected = node.get("is_selected");
    var node_title = renderTitle(node);
    var tabindex = is_selected ? 0 : -1;
    var is_open = node.get("is_open");
    var focusElement = function focusElement(el) {
        if (el) {
            el.focus();
        }
    };
    var props = {
        "className": title_classes,
        "tabIndex": tabindex,
        "role": "treeitem",
        "aria-selected": is_selected,
        "aria-expanded": is_open,
        "ref": is_selected ? focusElement : undefined
    };
    // todo: aria-level
    return _react2.default.createElement("span", Object.assign({}, props), node_title);
}
function TreeButton(_ref3) {
    var node = _ref3.node,
        onToggleNode = _ref3.onToggleNode;

    function handleClick(e) {
        e.preventDefault();
        e.stopPropagation();
        if (onToggleNode) {
            onToggleNode(node);
        }
    }
    var button_classes = (0, _classnames2.default)({
        "banyan-common": true,
        "banyan-toggler": true,
        "banyan-closed": !node.get("is_open")
    });
    var button_char = node.get("is_open") ? "▼" : "►";
    var props = {
        "className": button_classes,
        "onClick": handleClick,
        "role": "presentation",
        "aria-hidden": true,
        "tabIndex": -1
    };
    return _react2.default.createElement("a", Object.assign({ href: "#" }, props), button_char);
}
var defaultRenderTitle = function defaultRenderTitle(node) {
    return node.get("name");
};

var BaseTreeComponent = exports.BaseTreeComponent = function (_React$Component2) {
    _inherits(BaseTreeComponent, _React$Component2);

    function BaseTreeComponent(props) {
        _classCallCheck(this, BaseTreeComponent);

        var _this2 = _possibleConstructorReturn(this, (BaseTreeComponent.__proto__ || Object.getPrototypeOf(BaseTreeComponent)).call(this, props));

        _this2.setRootElement = _this2.setRootElement.bind(_this2);
        _this2.plugins = props.plugins || [];
        _this2.connectPlugins();
        return _this2;
    }

    _createClass(BaseTreeComponent, [{
        key: "render",
        value: function render() {
            var _props2 = this.props,
                tree = _props2.tree,
                onToggleNode = _props2.onToggleNode,
                onSelectNode = _props2.onSelectNode,
                renderTitle = _props2.renderTitle;

            var tree_context = {
                onToggleNode: onToggleNode,
                onSelectNode: onSelectNode,
                renderTitle: renderTitle || defaultRenderTitle
            };
            var props = {
                node: tree.root,
                tree_context: tree_context,
                setRootElement: this.setRootElement
            };
            return _react2.default.createElement(TreeFolder, Object.assign({}, props));
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.plugins[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var plugin = _step.value;

                    plugin.componentDidMount();
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.plugins[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var plugin = _step2.value;

                    plugin.componentWillUnmount();
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }
    }, {
        key: "getElement",
        value: function getElement() {
            return this.root_element;
        }
    }, {
        key: "setRootElement",
        value: function setRootElement(element) {
            this.root_element = element;
        }
    }, {
        key: "connectPlugins",
        value: function connectPlugins() {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this.plugins[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var plugin = _step3.value;

                    plugin.setTreeProxy(this);
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }
        }
    }]);

    return BaseTreeComponent;
}(_react2.default.Component);
//# sourceMappingURL=base_tree_component.js.map
