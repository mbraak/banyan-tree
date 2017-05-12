"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require("mobx-react");

var _base_tree_component = require("../base_tree_component");

var _keyboard_plugin = require("../keyboard_plugin");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MobxTree = function MobxTree(_ref) {
    var tree_store = _ref.tree_store,
        renderTitle = _ref.renderTitle,
        _ref$keyboardSupport = _ref.keyboardSupport,
        keyboardSupport = _ref$keyboardSupport === undefined ? true : _ref$keyboardSupport;

    var select = tree_store.select.bind(tree_store);
    var toggle = tree_store.toggle.bind(tree_store);
    var handleKey = tree_store.handleKey.bind(tree_store);
    var plugins = keyboardSupport ? [new _keyboard_plugin.KeyboardPlugin(handleKey)] : [];
    var props = {
        tree: tree_store.tree,
        renderTitle: renderTitle,
        onSelectNode: select,
        onToggleNode: toggle,
        plugins: plugins
    };
    return _react2.default.createElement(_base_tree_component.BaseTreeComponent, Object.assign({}, props));
};
exports.default = (0, _mobxReact.observer)(MobxTree);
//# sourceMappingURL=component.js.map
