"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/*
Definition of positions; these are used for moving a node
*/
var Position = {
    BEFORE: 1,
    AFTER: 2,
    INSIDE: 3,
    NONE: 4,

    strings: ["before", "after", "inside", "none"],

    getName: function getName(position) {
        return Position.strings[position - 1];
    },

    nameToIndex: function nameToIndex(name) {
        var index = Position.Strings.indexOf(name);

        if (index < 0) {
            return 0;
        } else {
            return index + 1;
        }
    }
};
exports.Position = Position;