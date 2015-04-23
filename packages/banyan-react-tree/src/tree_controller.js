/* @flow */
import {EventEmitter} from "events";

import {proxyEvents, proxyFunctions} from "./utils";
import {TreeStore} from "./tree_store";


class TreeController extends EventEmitter {
    setStore(store: TreeStore) {
        var tree = store.tree;

        proxyFunctions(
            this, tree,
            ["getNodeById", "getNodeByName"]
        );

        proxyFunctions(
            this, store,
            ["closeNode", "openNode", "selectNode", "toggleNode"]
        );

        proxyEvents(this, store, ["init"]);
        proxyEvents(this, store.tree, ["select"]);
    }
}

module.exports = TreeController;
