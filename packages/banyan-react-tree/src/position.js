/* @flow */

/* Definition of positions; these are used for moving a node */
export const Position = {
    BEFORE: 1,
    AFTER: 2,
    INSIDE: 3,
    NONE: 4,

    strings: ["before", "after", "inside", "none"],

    getName: (position: number): string => Position.strings[position - 1],

    nameToIndex: (name: string): number => {
        const index = Position.strings.indexOf(name);

        if (index < 0) {
            return 0;
        }
        else {
            return index + 1;
        }
    }
};
