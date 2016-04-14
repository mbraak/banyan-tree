/* @flow */
import React from "react";

import { TreeStore } from "./tree_store";
import { Node } from "./tree_node";


const TreeTitleComponent = (props: Object) => {
    const { node, store } = props;

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

    if (store.debug) {
        /* eslint-disable no-param-reassign */
        node.debug_draw_count = (node.debug_draw_count || 0) + 1;
        /* eslint-enable no-param-reassign */

        node_name += ` ${node.debug_draw_count.toString()}`;
    }

    return (
        <span className={classes} {...aria_props}>
            {node_name}
        </span>
    );
};

TreeTitleComponent.propTypes = {
    node: React.PropTypes.instanceOf(Node),
    store: React.PropTypes.instanceOf(TreeStore)
};

export default TreeTitleComponent;
