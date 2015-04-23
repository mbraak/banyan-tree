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
    var result = {};

    for (var key in properties) {
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

export function filterTrueKeys(object: Object): Array<any> {
    var true_keys = [];

    // todo: filter and map?
    for (var key in object) {
        if (object[key]) {
            true_keys.push(key);
        }
    }

    return true_keys;
}

export function toArray(value: any): Array<any> {
    if (!value) {
        return [];
    }
    else if (Array.isArray(value)) {
        return value;
    }
    else {
        return [value];
    }
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
