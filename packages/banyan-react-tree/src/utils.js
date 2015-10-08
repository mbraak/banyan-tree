/* @flow */
/*
Copy an object

- Does a shallow copy
- You can optionally skip keys

Example:

var copy = copyProperties(
    {
        name: 'abc',
        color: 'red'
    }
);

Copy properties but skip the key 'color':

var copy = copyProperties(
    {
        name: 'abc',
        color: 'red'
    },
    ['color']
);
*/
export function copyProperties(properties: Object, skip_keys: Array<string>): Object {
    const result = {};

    for (const key in properties) {
        if (skip_keys.indexOf(key) >= 0) {
            result[key] = properties[key];
        }
    }

    return result;
}

export function timeout(delay: number = 0): Promise {
    return new Promise(resolve => {
        setTimeout(resolve, delay || 0);
    });
}


export function proxyFunctions(target: Object, source:Object, function_names: Array<string>) {
    function_names.forEach((function_name) => {
        target[function_name] = source[function_name].bind(source);
    });
}


export function proxyEvents(target: Object, source: Object, event_names: Array<string>) {
    event_names.forEach((event_name) => {
        source.on(event_name, (e) => {
            target.emit(event_name, e);
        });
    });
}
