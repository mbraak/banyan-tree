/* @flow */
import React from "react";

import { TreeStore } from "./tree_store";
import { Node } from "./tree_node";


const TreeButtonComponent = ({ is_open, node, store }) => {
    function handleClick(e: any) {
        e.preventDefault();

        store.toggleNode(node);
    }

    let open_text, classes;

    if (is_open) {
        open_text = "&#x25bc;";
        classes = "banyan-toggler banyan-common";
    }
    else {
        open_text = "&#x25ba;";
        classes = "banyan-toggler banyan-closed banyan-common";
    }

    return (
        <a
          href="#"
          className={classes}
          role="presentation"
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: open_text }}
          onClick={handleClick}
        />
    );
};

TreeButtonComponent.propTypes = {
    is_open: React.PropTypes.bool,
    node: React.PropTypes.instanceOf(Node),
    store: React.PropTypes.instanceOf(TreeStore)
};

export default TreeButtonComponent;
