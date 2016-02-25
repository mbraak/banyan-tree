/* @flow */
import React from "react";

import type { TreeStore } from "./tree_store";


export default class TreePlaceholderComponent extends React.Component {
    props: {
        store: TreeStore
    };

    render() {
        const store = this.props.store;

        const style = {
            height: `${store.dragging.placeholder_height}px`
        };

        return <li style={style} className="banyan-placeholder banyan-common"></li>;
    }
}
