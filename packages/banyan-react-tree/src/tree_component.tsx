import React from "react";

import classNames from "classnames";

import { Tree } from "./immutable_tree";
import * as inode from "./immutable_node";
import { Node } from "./immutable_node";
import * as actions from "./actions";

export type Dispatch = (...params: any[]) => void;

interface ITreeNodeProps {
    node: Node;
    dispatch: Dispatch;
}

class TreeNode extends React.Component<ITreeNodeProps, {}> {
    public render(): JSX.Element|null {
        const { node, dispatch } = this.props;

        function handleClick(e: React.MouseEvent<HTMLDivElement>) {
            e.preventDefault();

            dispatch({
                type: actions.SELECT_NODE,
                node_id: node.id
            });
        }

        const is_folder = inode.hasChildren(node);
        const is_open_folder = is_folder && node.is_open;
        const is_selected = node.is_selected;

        const li_classes = classNames({
            "banyan-common": true,
            "banyan-closed": is_folder && !node.is_open,
            "banyan-folder": is_folder,
            "banyan-selected": is_selected
        });

        return (
            <li key={node.id} className={li_classes}>
                <div className="banyan-element banyan-common" onClick={handleClick}>
                    <TreeTitle node={node} />
                    {is_folder ? <TreeButton node={node} dispatch={dispatch} /> : null}
                </div>
                {is_open_folder ? <TreeFolder node={node} dispatch={dispatch} /> : null}
            </li>
        );
    }

    public shouldComponentUpdate(nextProps: ITreeNodeProps): boolean {
        return nextProps.node !== this.props.node;
    }
}

function TreeFolder({ node, dispatch }: {node: Node, dispatch: Dispatch}) {
    const ul_classes = classNames({
        "banyan-common": true,
        "banyan-tree": node.is_root
    });

    return (
        <ul className={ul_classes}>
            {inode.getChildren(node).map(
                (child: inode.Node) => <TreeNode key={child.id} node={child} dispatch={dispatch} />
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

function TreeButton({ node, dispatch }: {node: Node, dispatch: Dispatch}) {
    function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
        e.preventDefault();

        dispatch({
            type: actions.TOGGLE_NODE,
            node_id: node.id
        });
    }

    const button_classes = classNames({
        "banyan-common": true,
        "banyan-toggler": true,
        "banyan-closed": !node.is_open
    });

    const button_char = node.is_open ? "▼" : "►";

    return (
        <a href="#" className={button_classes} onClick={handleClick}>
            {button_char}
        </a>
    );
}

export default function TreeComponent({ tree, dispatch }: {tree: Tree, dispatch: Dispatch}) {
    return <TreeFolder node={tree.root} dispatch={dispatch} />;
}
