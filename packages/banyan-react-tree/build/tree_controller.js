'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
    value: true
});

var TreeController = (function () {
    function TreeController() {
        _classCallCheck(this, TreeController);
    }

    _createClass(TreeController, [{
        key: 'onInit',
        value: function onInit() {}
    }, {
        key: '_setStore',
        value: function _setStore(store) {
            var tree = store.tree;

            proxyFunctions(this, tree, ['getNodeById', 'getNodeByName']);

            proxyFunctions(this, store, ['closeNode', 'openNode', 'selectNode', 'toggleNode']);
        }
    }]);

    return TreeController;
})();

exports['default'] = TreeController;

function proxyFunctions(target, source, function_names) {
    function_names.forEach(function (function_name) {
        target[function_name] = source[function_name].bind(source);
    });
}
module.exports = exports['default'];

//