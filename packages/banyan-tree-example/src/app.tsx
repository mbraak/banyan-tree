import React from "react";
import { TreeComponent } from "banyan-react-tree/lib/tree_component";
import { Tree } from "banyan-immutable-tree/lib/immutable_tree";
import { Node } from "banyan-immutable-tree/lib/immutable_node";

function renderTitle(node: Node) {
    const name = node.get("name");
    const rank = node.get("rank");
    const url = node.get("url");
    const species_count = node.get("species_count");

    return (
        <span>
            {url
                ? <a href={url} className="title" target="_blank" tabIndex={-1}>
                      {name}
                  </a>
                : name}
            <span className="rank">{rank}</span>
            {species_count
                ? <span className="species-count">{species_count} species</span>
                : null}
        </span>
    );
}

function App({ tree }: { tree: Tree }) {
    return <TreeComponent tree={tree} renderTitle={renderTitle} />;
}

export default App;
