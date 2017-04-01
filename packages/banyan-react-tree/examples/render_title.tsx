import React from "react";

import { Node } from "../src/immutable_node";

export default function renderTitle(node: Node) {
    const name = node.get("name");
    const rank = node.get("rank");
    const url = node.get("url");
    const species_count = node.get("species_count");

    return (
        <span>
            { url
                ? <a href={url} className="title" target="_blank">{name}</a>
                : name
            }
            <span className="rank">{rank}</span>
            { species_count
                ? <span className="species-count">{species_count } species</span>
                : null
            }
        </span>
    );
}
