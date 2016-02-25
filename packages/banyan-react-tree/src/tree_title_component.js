/* @flow */
import React from "react";

import type { TreeStore } from "./tree_store";
import type { Node } from "./tree_node";


export default class TreeTitleComponent extends React.Component {
    props: {
        node: Node,
        store: TreeStore
    };

    render() {
        const node = this.props.node;
        let classes = "banyan-title banyan-common";

        if (node.isFolder()) {
            classes += " banyan-title-folder";
        }

        const aria_props = {
            role: "treeitem",
            "aria-selected": node.is_selected,
            "aria-expanded": node.isFolder() && node.is_open
        };

        let node_name = node.name;

        if (this.props.store.debug) {
            node.debug_draw_count = (node.debug_draw_count || 0) + 1;
            node_name += ` ${node.debug_draw_count.toString()}`;
        }

        return (
            <span className={classes} {...aria_props}>
                {node_name}
            </span>
        );
    }
}
