/* @flow */
import EventEmitter from "eventemitter3";

import {proxyEvents, proxyFunctions} from "./utils";


export default class TreeController extends EventEmitter {
    setStore(store: Object) {
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
        proxyEvents(this, store.tree, ["close", "open", "select"]);
    }
}
