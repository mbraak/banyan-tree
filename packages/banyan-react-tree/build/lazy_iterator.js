"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});
/* @flow */

var _Node = require("./tree_node");

/*
Iterate over all nodes. Load nodes on demand if necessary.

- Return Promise(iteration is done)
*/

var LazyIterator = (function () {
    function LazyIterator(root) {
        _classCallCheck(this, LazyIterator);

        this.root = root;

        this.on_must_continue = null;
        this.on_before_load = null;
        this.on_visit = null;
        this.must_include_root = false;
        this.visit_count = 0;
    }

    _createClass(LazyIterator, [{
        key: "root",
        value: undefined,
        enumerable: true
    }, {
        key: "on_must_continue",
        value: undefined,
        enumerable: true
    }, {
        key: "on_before_load",
        value: undefined,
        enumerable: true
    }, {
        key: "on_visit",
        value: undefined,
        enumerable: true
    }, {
        key: "must_include_root",
        value: undefined,
        enumerable: true
    }, {
        key: "visit_count",
        value: undefined,
        enumerable: true
    }, {
        key: "iterate",
        value: function iterate() {
            return this.iterateNode(this.root, 0, this.must_include_root);
        }
    }, {
        key: "mustContinue",

        // Must continue iteration?
        value: function mustContinue(node, level) {
            var on_must_continue = this.on_must_continue;

            if (on_must_continue) {
                return on_must_continue(node, level);
            } else {
                return true;
            }
        }
    }, {
        key: "visitNode",
        value: function visitNode(node) {
            var on_visit = this.on_visit;

            if (on_visit) {
                on_visit(node);

                this.visit_count += 1;
            }
        }
    }, {
        key: "iterateChildren",

        // Iterate children of node; return promise
        value: function iterateChildren(node, level) {
            var _this = this;

            if (!node.children) {
                return Promise.resolve();
            } else {
                return Promise.all(node.children.map(function (child) {
                    return _this.iterateNode(child, level + 1, true);
                }));
            }
        }
    }, {
        key: "iterateNode",

        // Iterate node recusively; return promise
        value: function iterateNode(node, level, include_self) {
            var _this2 = this;

            // Must continue?
            var must_continue;

            if (!include_self) {
                must_continue = true;
            } else {
                must_continue = this.mustContinue(node, level);
            }

            if (!must_continue) {
                // No
                return Promise.resolve();
            } else {
                // Yes
                if (!node.load_on_demand) {
                    if (include_self) {
                        this.visitNode(node, include_self);
                    }

                    return this.iterateChildren(node, level);
                } else {
                    // load node on demand
                    var promise = node.loadOnDemand().then(function () {
                        if (include_self) {
                            _this2.visitNode(node);
                        }

                        return _this2.iterateChildren(node, level);
                    });

                    // call on_before_load
                    var on_before_load = this.on_before_load;

                    if (on_before_load) {
                        on_before_load(node);
                    }

                    return promise;
                }
            }
        }
    }]);

    return LazyIterator;
})();

exports.LazyIterator = LazyIterator;