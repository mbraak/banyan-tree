/* @flow */
import React from "react";

import classNames from "classnames";

import { VelocityTransitionGroup } from "velocity-react";

import TreePlaceholderComponent from "./tree_place_holder_component";
import TreeNodeComponent from "./tree_node_component";

import type { TreeStore } from "./tree_store";
import type { Node } from "./tree_node";


export default class TreeFolderComponent extends React.Component {
    props: {
        node: Node,
        store: TreeStore
    };

    render() {
        const folder = this.props.node;
        const store = this.props.store;
        const is_root = !folder.parent;

        const classes = classNames({
            "banyan-common": true,
            "banyan-loading": folder.is_loading,
            "banyan-tree": is_root
        });

        function getRole() {
            if (!folder.parent) {
                return "tree";
            }
            else {
                return "group";
            }
        }

        const children = [];

        if (folder.is_open || is_root) {
            folder.children.forEach((node) => {
                if (store.isNodeHovered(node)) {
                    children.push(
                        <TreePlaceholderComponent key={`${node.id}-placeholder`} store={store} />
                    );
                }

                if (!store.isNodeDragged(node)) {
                    children.push(
                        <TreeNodeComponent key={node.id} node={node} store={store} />
                    );
                }
            });
        }

        return (
            <ul className={classes} role={getRole()}>
                <VelocityTransitionGroup enter={{ animation: "slideDown" }} leave={{ animation: "slideUp" }}>
                    {children}
                </VelocityTransitionGroup>
            </ul>
        );
    }

    shouldComponentUpdate(): boolean {
        return this.props.store.isNodeChanged(this.props.node);
    }
}
