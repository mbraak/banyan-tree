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

    for (var key in object) {
        if (object[key]) {
            true_keys.push(key);
        }
    }

    return true_keys;
}

export function to_array(value: any): Array<any> {
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
