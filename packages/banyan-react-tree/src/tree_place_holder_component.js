/* @flow */
import React from "react";

import { TreeStore } from "./tree_store";


const TreePlaceholderComponent = (props: Object) => {
    const { store } = props;

    const style = {
        height: `${store.dragging.placeholder_height}px`
    };

    return <li style={style} className="banyan-placeholder banyan-common" />;
};

TreePlaceholderComponent.propTypes = {
    store: React.PropTypes.instanceOf(TreeStore)
};

export default TreePlaceholderComponent;
