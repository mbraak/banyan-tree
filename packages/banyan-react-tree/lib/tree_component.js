"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TreeComponent = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _base_tree_component = require("./base_tree_component");

var _keyboard_plugin = require("./keyboard_plugin");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TreeComponent = exports.TreeComponent = function (_React$Component) {
    _inherits(TreeComponent, _React$Component);

    function TreeComponent(props) {
        _classCallCheck(this, TreeComponent);

        var _this = _possibleConstructorReturn(this, (TreeComponent.__proto__ || Object.getPrototypeOf(TreeComponent)).call(this, props));

        _this.state = { tree: props.tree };
        _this.handleToggle = _this.handleToggle.bind(_this);
        _this.handleSelect = _this.handleSelect.bind(_this);
        _this.handleKey = _this.handleKey.bind(_this);
        return _this;
    }

    _createClass(TreeComponent, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            var tree = this.state.tree;
            var _props = this.props,
                renderTitle = _props.renderTitle,
                keyboardSupport = _props.keyboardSupport;

            var createKeyboardPlugin = function createKeyboardPlugin() {
                return new _keyboard_plugin.KeyboardPlugin(_this2.handleKey);
            };
            var plugins = keyboardSupport ? [createKeyboardPlugin()] : [];
            var props = {
                tree: tree,
                renderTitle: renderTitle,
                onToggleNode: this.handleToggle,
                onSelectNode: this.handleSelect,
                plugins: plugins
            };
            return _react2.default.createElement(_base_tree_component.BaseTreeComponent, Object.assign({}, props));
        }
    }, {
        key: "handleToggle",
        value: function handleToggle(node) {
            var tree = this.state.tree;

            this.setState({
                tree: tree.toggleNode(node.get("id"))
            });
        }
    }, {
        key: "handleSelect",
        value: function handleSelect(node) {
            var tree = this.state.tree;

            this.setState({
                tree: tree.selectNode(node.get("id"))
            });
        }
    }, {
        key: "handleKey",
        value: function handleKey(key) {
            var tree = this.state.tree;

            var _tree$handleKey = tree.handleKey(key),
                _tree$handleKey2 = _slicedToArray(_tree$handleKey, 2),
                is_handled = _tree$handleKey2[0],
                new_tree = _tree$handleKey2[1];

            if (!is_handled) {
                return false;
            } else {
                this.setState({ tree: new_tree });
                return true;
            }
        }
    }]);

    return TreeComponent;
}(_react2.default.Component);

TreeComponent.defaultProps = {
    keyboardSupport: true
};
//# sourceMappingURL=tree_component.js.map
