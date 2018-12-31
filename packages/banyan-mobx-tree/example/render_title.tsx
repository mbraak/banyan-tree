import * as React from "react";

import { Node } from "banyan-immutable-tree/lib/immutable_node";

export default function renderTitle(node: Node) {
    const name = node.get("name");
    const rank = node.get("rank");
    const url = node.get("url");
    const speciesCount = node.get("species_count");

    return (
        <span>
            {url ? (
                <a href={url} className="title" target="_blank" tabIndex={-1}>
                    {name}
                </a>
            ) : (
                name
            )}
            <span className="rank">{rank}</span>
            {speciesCount ? (
                <span className="species-count">{speciesCount} species</span>
            ) : null}
        </span>
    );
}
