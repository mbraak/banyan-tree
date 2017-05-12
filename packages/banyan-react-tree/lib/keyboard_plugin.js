"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.KeyboardPlugin = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _plugin = require("./plugin");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var KeyboardPlugin = exports.KeyboardPlugin = function (_Plugin) {
    _inherits(KeyboardPlugin, _Plugin);

    function KeyboardPlugin(onHandleKey) {
        _classCallCheck(this, KeyboardPlugin);

        var _this = _possibleConstructorReturn(this, (KeyboardPlugin.__proto__ || Object.getPrototypeOf(KeyboardPlugin)).call(this));

        _this.onHandleKey = onHandleKey;
        _this.handleKey = _this.handleKey.bind(_this);
        return _this;
    }

    _createClass(KeyboardPlugin, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            window.addEventListener("keydown", this.handleKey);
        }
    }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
            window.removeEventListener("keydown", this.handleKey);
        }
    }, {
        key: "handleKey",
        value: function handleKey(event) {
            var key = event.key;

            var onHandleKey = this.onHandleKey;
            if (this.canHandleKeyboard(key) && onHandleKey) {
                var is_handled = onHandleKey(key);
                if (is_handled) {
                    event.preventDefault();
                }
            }
        }
    }, {
        key: "canHandleKeyboard",
        value: function canHandleKeyboard(key) {
            return this.isArrowKey(key), this.isFocusOnTree();
        }
    }, {
        key: "isArrowKey",
        value: function isArrowKey(key) {
            return key === "ArrowUp" || key === "ArrowDown" || key === "ArrowLeft" || key === "ArrowRight";
        }
    }, {
        key: "isFocusOnTree",
        value: function isFocusOnTree() {
            var active_element = document.activeElement;
            var tree_element = this.tree_proxy && this.tree_proxy.getElement();
            return active_element != null && tree_element != null && isParentOf(tree_element, active_element);
        }
    }]);

    return KeyboardPlugin;
}(_plugin.Plugin);

function isParentOf(parent, child) {
    var current_parent = child.parentElement;
    while (current_parent) {
        if (current_parent === parent) {
            return true;
        }
        current_parent = current_parent.parentElement;
    }
    return false;
}
//# sourceMappingURL=keyboard_plugin.js.map
