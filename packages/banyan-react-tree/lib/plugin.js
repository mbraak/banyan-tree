"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Plugin = exports.Plugin = function () {
    function Plugin() {
        _classCallCheck(this, Plugin);
    }

    _createClass(Plugin, [{
        key: "setTreeProxy",
        value: function setTreeProxy(tree_proxy) {
            this.tree_proxy = tree_proxy;
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            //
        }
    }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
            //
        }
    }]);

    return Plugin;
}();
//# sourceMappingURL=plugin.js.map
