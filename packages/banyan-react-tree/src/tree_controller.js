export default class TreeController {
    onInit() {
        //
    }

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
    }
}


function proxyFunctions(target, source, function_names) {
    function_names.forEach((function_name) => {
        target[function_name] = source[function_name].bind(source);
    });
}
