"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

/* @flow */

var _EventEmitter2 = require("eventemitter3");

var _EventEmitter3 = _interopRequireWildcard(_EventEmitter2);

var _proxyEvents$proxyFunctions = require("./utils");

var TreeController = (function (_EventEmitter) {
    function TreeController() {
        _classCallCheck(this, TreeController);

        if (_EventEmitter != null) {
            _EventEmitter.apply(this, arguments);
        }
    }

    _inherits(TreeController, _EventEmitter);

    _createClass(TreeController, [{
        key: "setStore",
        value: function setStore(store) {
            var tree = store.tree;

            _proxyEvents$proxyFunctions.proxyFunctions(this, tree, ["getNodeById", "getNodeByName"]);

            _proxyEvents$proxyFunctions.proxyFunctions(this, store, ["closeNode", "openNode", "selectNode", "toggleNode"]);

            _proxyEvents$proxyFunctions.proxyEvents(this, store, ["init"]);
            _proxyEvents$proxyFunctions.proxyEvents(this, store.tree, ["close", "open", "select"]);
        }
    }]);

    return TreeController;
})(_EventEmitter3["default"]);

module.exports = TreeController;