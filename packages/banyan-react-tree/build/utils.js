"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
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
exports.copyProperties = copyProperties;
exports.timeout = timeout;
exports.filterTrueKeys = filterTrueKeys;
exports.to_array = to_array;

function copyProperties(properties, skip_keys) {
    var result = {};

    for (var key in properties) {
        if (skip_keys.indexOf(key) >= 0) {
            result[key] = properties[key];
        }
    }

    return result;
}

function timeout() {
    var delay = arguments[0] === undefined ? 0 : arguments[0];

    return new Promise(function (resolve) {
        setTimeout(resolve, delay || 0);
    });
}

function filterTrueKeys(object) {
    var true_keys = [];

    // todo: filter and map?
    for (var key in object) {
        if (object[key]) {
            true_keys.push(key);
        }
    }

    return true_keys;
}

function to_array(value) {
    if (!value) {
        return [];
    } else if (Array.isArray(value)) {
        return value;
    } else {
        return [value];
    }
}