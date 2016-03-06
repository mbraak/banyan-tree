/* @flow */
import React from "react";

import { TreeStore } from "./tree_store";


const TreePlaceholderComponent = ({ store }) => {
    const style = {
        height: `${store.dragging.placeholder_height}px`
    };

    return <li style={style} className="banyan-placeholder banyan-common"></li>;
};

TreePlaceholderComponent.propTypes = {
    store: React.PropTypes.instanceOf(TreeStore)
};

export default TreePlaceholderComponent;
