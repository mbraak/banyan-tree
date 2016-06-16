/* @flow */
import React from "react";

import classNames from "classnames";

import TreeTitleComponent from "./tree_title_component";
import TreeButtonComponent from "./tree_button_component";
import TreeFolderComponent from "./tree_folder_component";
import { Position } from "./position";
import { timeout } from "./utils";

import type { TreeStore } from "./tree_store";
import type { Node } from "./tree_node";


export default class TreeNodeComponent extends React.Component {
    props: {
        node: Node,
        store: TreeStore
    };

    render() {
        const { node, store } = this.props;

        function getClasses() {
            return classNames({
                "banyan-closed": !node.is_open,
                "banyan-common": true,
                "banyan-dragged": store.isNodeDragged(node),
                "banyan-folder": node.isFolder(),
                "banyan-loading": node.is_loading,
                "banyan-hover": store.isNodeHovered(node),
                "banyan-selected": node.is_selected
            });
        }

        function getButtonElement() {
            if (node.isFolder()) {
                return <TreeButtonComponent node={node} is_open={node.is_open} store={store} />;
            }
            else {
                return null;
            }
        }

        function getFolderElement() {
            if (node.isFolder() && node.is_open) {
                return <TreeFolderComponent node={node} store={store} />;
            }
            else {
                return null;
            }
        }

        const mouse_props = {};

        if (store.drag_and_drop) {
            mouse_props.onMouseDown = this.handleMouseDown.bind(this);

            if (store.dragging.node) {
                mouse_props.onMouseEnter = this.handleMouseEnter.bind(this);
            }
        }

        // todo: use ::this.handleClick when flow supports it
        return (
            <li className={getClasses()} role="presentation">
                <div className="banyan-element banyan-common" role="presentation" {...mouse_props} onClick={this.handleClick.bind(this)}>
                    <TreeTitleComponent node={node} store={store} />
                    {getButtonElement()}
                </div>
                {getFolderElement()}
            </li>
        );
    }

    handleMouseDown(e: any) {
        const node = this.props.node;
        const store = this.props.store;

        const li_node = e.currentTarget.parentNode;

        let waiting_for_delay = true;
        let dragging_started = false;

        // Uses EventListener objects instead of functions to prevent flow error
        // todo: use functions when bug in flow is fixed
        const handleMouseMove = {
            handleEvent: function handleMouseMove() {
                if (waiting_for_delay) {
                    return true;
                }
                else if (!dragging_started) {
                    dragging_started = true;
                    store.startDragging(node, li_node.clientHeight);
                }

                return false;
            }
        };

        const handleMouseUp = {
            handleEvent: function handleMouseUp() {
                if (store.dragging.hover_node) {
                    store.tree.moveNode(
                        store.dragging.node,
                        store.dragging.hover_node,
                        Position.BEFORE
                    );
                }

                store.stopDragging();

                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
            }
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        timeout(300).then(() => {
            waiting_for_delay = false;
        });

        e.preventDefault();
    }

    handleMouseEnter() {
        this.props.store.hoverNode(this.props.node);
    }

    shouldComponentUpdate(): boolean {
        return this.props.store.isNodeChanged(this.props.node);
    }

    handleClick(e: any) {
        e.preventDefault();

        const node = this.props.node;

        this.props.store.selectNode(node);
    }
}
