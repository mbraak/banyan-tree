/* @flow */
import React from "react";

import classNames from "classnames";

import { TreeStore } from "./tree_store";
import { Node } from "./tree_node";


const TreeButtonComponent = ({ is_open, node, store }) => {
    function handleClick(e: any) {
        e.preventDefault();

        store.toggleNode(node);
    }

    return (
        <a
          href="#"
          className={ classNames("banyan-toggler", "banyan-common", { "banyan-closed": !is_open }) }
          role="presentation"
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: getButtonChar(is_open) }}
          onClick={handleClick}
        />
    );
};


function getButtonChar(is_open) {
    if (is_open) {
        return "&#x25bc;";
    }
    else {
        return "&#x25ba;";
    }
}


TreeButtonComponent.propTypes = {
    is_open: React.PropTypes.bool,
    node: React.PropTypes.instanceOf(Node),
    store: React.PropTypes.instanceOf(TreeStore)
};

export default TreeButtonComponent;
