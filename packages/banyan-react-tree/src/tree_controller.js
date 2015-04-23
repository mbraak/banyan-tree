/* @flow */
import {EventEmitter} from "events";


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


function proxyFunctions(target, source, function_names) {
    function_names.forEach((function_name) => {
        target[function_name] = source[function_name].bind(source);
    });
}


function proxyEvents(target, source, event_names) {
    event_names.forEach((event_name) => {
        source.on(event_name, (e) => {
            target.emit(event_name, e);
        });
    });
}
