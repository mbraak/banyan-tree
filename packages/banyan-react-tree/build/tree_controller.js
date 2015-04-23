'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, '__esModule', {
    value: true
});
/* @flow */

var _EventEmitter2 = require('events');

var TreeController = (function (_EventEmitter) {
    function TreeController() {
        _classCallCheck(this, TreeController);

        if (_EventEmitter != null) {
            _EventEmitter.apply(this, arguments);
        }
    }

    _inherits(TreeController, _EventEmitter);

    _createClass(TreeController, [{
        key: '_setStore',
        value: function _setStore(store) {
            var tree = store.tree;

            proxyFunctions(this, tree, ['getNodeById', 'getNodeByName']);

            proxyFunctions(this, store, ['closeNode', 'openNode', 'selectNode', 'toggleNode']);

            proxyEvents(this, store, ['init']);
            proxyEvents(this, store.tree, ['select']);
        }
    }]);

    return TreeController;
})(_EventEmitter2.EventEmitter);

exports['default'] = TreeController;

function proxyFunctions(target, source, function_names) {
    function_names.forEach(function (function_name) {
        target[function_name] = source[function_name].bind(source);
    });
}

function proxyEvents(target, source, event_names) {
    event_names.forEach(function (event_name) {
        source.on(event_name, function (e) {
            target.emit(event_name, e);
        });
    });
}
module.exports = exports['default'];