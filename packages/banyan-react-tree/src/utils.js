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
import { xhttp } from "xhttp/dist/xhttp";


export function copyProperties(properties: Object, skip_keys: Array<string> = []): Object {
    const result = {};

    Object.entries(properties).forEach(
        ([key, value]) => {
            if (skip_keys.indexOf(key) >= 0) {
                result[key] = value;
            }
        }
    );

    return result;
}

export function timeout(delay: number = 0): Promise<null> {
    return new Promise(resolve => {
        setTimeout(resolve, delay || 0);
    });
}


export function proxyFunctions(target: Object, source:Object, function_names: Array<string>) {
    const t = target;

    function_names.forEach((function_name) => {
        t[function_name] = source[function_name].bind(source);
    });
}


export function proxyEvents(target: Object, source: Object, event_names: Array<string>) {
    event_names.forEach((event_name) => {
        source.on(event_name, (e) => {
            target.emit(event_name, e);
        });
    });
}


export function xhttpPromise(params: Object): Promise<any> {
    return new Promise(
        (resolve, reject) => xhttp(params, resolve, reject)
    );
}
