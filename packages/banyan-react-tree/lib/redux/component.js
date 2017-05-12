"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _base_tree_component = require("../base_tree_component");

var _actions = require("./actions");

var actions = _interopRequireWildcard(_actions);

var _keyboard_plugin = require("../keyboard_plugin");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ReduxTree = function ReduxTree(_ref) {
    var tree = _ref.tree,
        dispatch = _ref.dispatch,
        renderTitle = _ref.renderTitle,
        tree_id = _ref.tree_id,
        _ref$keyboardSupport = _ref.keyboardSupport,
        keyboardSupport = _ref$keyboardSupport === undefined ? true : _ref$keyboardSupport;

    var handleSelect = function handleSelect(node) {
        dispatch({
            type: actions.SELECT_NODE,
            node_id: node.get("id"),
            tree_id: tree_id
        });
    };
    var handleToggle = function handleToggle(node) {
        dispatch({
            type: actions.TOGGLE_NODE,
            node_id: node.get("id"),
            tree_id: tree_id
        });
    };
    var handleKey = function handleKey(key) {
        dispatch({
            type: actions.HANDLE_KEY,
            key: key,
            tree_id: tree_id
        });
        return true;
    };
    var plugins = keyboardSupport ? [new _keyboard_plugin.KeyboardPlugin(handleKey)] : [];
    var props = {
        tree: tree,
        onToggleNode: handleToggle,
        onSelectNode: handleSelect,
        renderTitle: renderTitle,
        plugins: plugins
    };
    return _react2.default.createElement(_base_tree_component.BaseTreeComponent, Object.assign({}, props));
};
exports.default = ReduxTree;
//# sourceMappingURL=component.js.map
