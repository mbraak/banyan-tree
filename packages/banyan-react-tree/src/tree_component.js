/* @flow */
import React from "react";

import classNames from "classnames";

import type { Tree } from "./immutable_tree";
import * as inode from "./immutable_node";
import * as actions from "./actions";

const { Node } = inode;


export default function TreeComponent({ tree, dispatch }: {tree: Tree, dispatch: Function}) {
    function TreeNode({ node }: {node: Node}) {
        function handleClick(e) {
            e.preventDefault();

            dispatch({
                type: actions.SELECT_NODE,
                node_id: node.id
            });
        }

        const is_folder = inode.hasChildren(node);
        const is_open_folder = tree.isNodeOpen(node.id);
        const is_selected = tree.selected === node.id;

        const li_classes = classNames({
            "banyan-common": true,
            "banyan-closed": !is_open_folder,
            "banyan-folder": is_folder,
            "banyan-selected": is_selected
        });

        return (
            <li key={node.id} className={li_classes}>
                <div className="banyan-element banyan-common" onClick={handleClick}>
                    <TreeTitle node={node} />
                    {is_folder ? <TreeButton node={node} is_open={is_open_folder} /> : null}
                </div>
                {is_open_folder ? <TreeFolder node={node} is_root={false} /> : null}
            </li>
        );
    }

    function TreeFolder({ node, is_root }: {node: Node, is_root: boolean}) {
        const ul_classes = classNames({
            "banyan-common": true,
            "banyan-tree": is_root
        });

        return (
            <ul className={ul_classes}>
                {inode.getChildren(node).map(
                    child => <TreeNode key={child.id} node={child} />
                )}
            </ul>
        );
    }

    function TreeTitle({ node }: {node: Node}) {
        const title_classes = classNames({
            "banyan-common": true,
            "banyan-title": true,
            "banyan-title-folder": inode.hasChildren(node)
        });
        // const random_number = Math.trunc(Math.random() * 100);
        // {`${random_number}`}

        return (
            <span className={title_classes}>
                {node.name}
            </span>
        );
    }

    function TreeButton({ node, is_open }: {node: Node, is_open: boolean}) {
        function handleClick(e) {
            e.preventDefault();

            dispatch({
                type: actions.TOGGLE_NODE,
                node_id: node.id
            });
        }

        const button_classes = classNames({
            "banyan-common": true,
            "banyan-toggler": true,
            "banyan-closed": !is_open
        });

        const button_char = is_open ? "▼" : "►";

        return (
            <a href="#" className={button_classes} onClick={handleClick}>
                {button_char}
            </a>
        );
    }

    return <TreeFolder node={tree.root} is_root />;
}
