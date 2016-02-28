/* @flow */
import React from "react";

import type { TreeStore } from "./tree_store";
import type { Node } from "./tree_node";


export default class TreeButtonComponent extends React.Component {
    props: {
        is_open: boolean,
        node: Node,
        store: TreeStore
    };

    render() {
        const is_open = this.props.is_open;
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
              onClick={this.handleClick.bind(this)}
            />
        );
    }

    handleClick(e: any) {
        e.preventDefault();

        this.props.store.toggleNode(this.props.node);
    }
}
