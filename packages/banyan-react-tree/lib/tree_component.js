"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = TreeComponent;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _immutable_node = require("./immutable_node");

var inode = _interopRequireWildcard(_immutable_node);

var _actions = require("./actions");

var actions = _interopRequireWildcard(_actions);

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
                dispatch = _props.dispatch;

            function handleClick(e) {
                e.preventDefault();
                dispatch({
                    type: actions.SELECT_NODE,
                    node_id: node.id
                });
            }
            var is_folder = inode.hasChildren(node);
            var is_open_folder = is_folder && node.is_open;
            var is_selected = node.is_selected;
            var li_classes = (0, _classnames2.default)({
                "banyan-common": true,
                "banyan-closed": is_folder && !node.is_open,
                "banyan-folder": is_folder,
                "banyan-selected": is_selected
            });
            return _react2.default.createElement("li", { key: node.id, className: li_classes }, _react2.default.createElement("div", { className: "banyan-element banyan-common", onClick: handleClick }, _react2.default.createElement(TreeTitle, { node: node }), is_folder ? _react2.default.createElement(TreeButton, { node: node, dispatch: dispatch }) : null), is_open_folder ? _react2.default.createElement(TreeFolder, { node: node, dispatch: dispatch }) : null);
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
        dispatch = _ref.dispatch;

    var ul_classes = (0, _classnames2.default)({
        "banyan-common": true,
        "banyan-tree": node.is_root
    });
    return _react2.default.createElement("ul", { className: ul_classes }, inode.getChildren(node).map(function (child) {
        return _react2.default.createElement(TreeNode, { key: child.id, node: child, dispatch: dispatch });
    }));
}
function TreeTitle(_ref2) {
    var node = _ref2.node;

    var title_classes = (0, _classnames2.default)({
        "banyan-common": true,
        "banyan-title": true,
        "banyan-title-folder": inode.hasChildren(node)
    });
    // const random_number = Math.trunc(Math.random() * 100);
    // {`${random_number}`}
    return _react2.default.createElement("span", { className: title_classes }, node.name);
}
function TreeButton(_ref3) {
    var node = _ref3.node,
        dispatch = _ref3.dispatch;

    function handleClick(e) {
        e.preventDefault();
        dispatch({
            type: actions.TOGGLE_NODE,
            node_id: node.id
        });
    }
    var button_classes = (0, _classnames2.default)({
        "banyan-common": true,
        "banyan-toggler": true,
        "banyan-closed": !node.is_open
    });
    var button_char = node.is_open ? "▼" : "►";
    return _react2.default.createElement("a", { href: "#", className: button_classes, onClick: handleClick }, button_char);
}
function TreeComponent(_ref4) {
    var tree = _ref4.tree,
        dispatch = _ref4.dispatch;

    return _react2.default.createElement(TreeFolder, { node: tree.root, dispatch: dispatch });
}
//# sourceMappingURL=tree_component.js.map
