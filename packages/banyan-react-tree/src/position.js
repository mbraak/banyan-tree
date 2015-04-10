/*
Definition of positions; these are used for moving a node
*/
export var Position = {
    BEFORE: 1,
    AFTER: 2,
    INSIDE: 3,
    NONE: 4,

    strings: ["before", "after", "inside", "none"],

    getName: function(position) {
        return Position.strings[position - 1];
    },

    nameToIndex: function(name) {
        var index = Position.Strings.indexOf(name);

        if (index < 0) {
            return 0;
        }
        else {
            return index + 1;
        }
    }
};