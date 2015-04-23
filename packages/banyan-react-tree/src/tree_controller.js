/* @flow */
import {EventEmitter} from "events";

import {proxyEvents, proxyFunctions} from "./utils";


export default class TreeController extends EventEmitter {
    _setStore(store) {
        var tree = store.tree;

        proxyFunctions(
            this, tree,
            ['getNodeById', 'getNodeByName']
        );

        proxyFunctions(
            this, store,
            ['closeNode', 'openNode', 'selectNode', 'toggleNode']
        );

        proxyEvents(this, store, ['init']);
        proxyEvents(this, store.tree, ['select']);
    }
}
