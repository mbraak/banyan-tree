import { random, range, join } from "lodash";

import { Tree } from "../../src/immutable_tree";
import { NodeId } from "../../src/immutable_node";

function pickRandom<T>(array: T[]): T {
    if (!array.length) {
        throw new Error("pickRandom: array is empty");
    }

    return array[random(array.length - 1)];
}

export function pickWeightedRandom(weights: any): any {
    const n = random(99);

    let subtotal = 0;

    for (const value of Object.keys(weights)) {
        const weight = weights[value];
        subtotal += weight;

        if (n < subtotal) {
            return value;
        }
    }

    throw new Error("pickWeightedRandom: weights are invalid");
}

export const randomNodeId = (tree: Tree): NodeId|null => {
    const ids = tree.getIds();

    if (!ids.length) {
        return null;
    }
    else {
        return pickRandom(ids);
    }
};

// Pick a random node id or null
export const randomNodeIdOrNull = (tree: Tree): NodeId|null => {
    const ids: Array<NodeId|null> = tree.getIds();
    ids.push(null);

    return pickRandom(ids);
};

let new_id = 1;

export const newId = (): number => {
    const result = new_id;

    new_id += 1;

    return result;
};

const char_code_a = "a".charCodeAt(0);

const randomChar = (): string => (
    String.fromCharCode(random(25) + char_code_a)
);

export const randomString = (): string => (
    join(
        range(random(10) + 5).map(randomChar),
        ""
    )
);
