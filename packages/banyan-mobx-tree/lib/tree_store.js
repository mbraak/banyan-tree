"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mobx_1 = require("mobx");
class TreeStore {
    constructor(tree) {
        this.tree = tree;
    }
    select(node) {
        this.tree = this.tree.selectNode(node.get("id"));
    }
    toggle(node) {
        this.tree = this.tree.toggleNode(node.get("id"));
    }
    handleKey(key) {
        const [is_handled, tree] = this.tree.handleKey(key);
        if (is_handled) {
            this.tree = tree;
            return true;
        }
    }
}
__decorate([
    mobx_1.observable
], TreeStore.prototype, "tree", void 0);
exports.default = TreeStore;
//# sourceMappingURL=tree_store.js.map