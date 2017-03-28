import React from "react";

import { TreeComponent } from "../tree_component";
import { Tree } from "../immutable_tree";
import { Node } from "../immutable_node";

const renderTitle = (node: Node) => {
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
};

function App({ tree }: { tree: Tree }) {
    return <TreeComponent tree={tree} renderTitle={renderTitle} />;
}

export default App;
