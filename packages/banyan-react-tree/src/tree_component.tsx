import React from "react";

import classNames from "classnames";

import { Tree } from "./immutable_tree";
import * as inode from "./immutable_node";
import { Node } from "./immutable_node";
import * as actions from "./actions";

export type Dispatch = (...params: any[]) => void;

export type RenderNode = (node: Node) => JSX.Element;

interface ITreeNodeProps {
    node: Node;
    dispatch: Dispatch;
    renderTitle?: RenderNode;
}

class TreeNode extends React.Component<ITreeNodeProps, {}> {
    public render(): JSX.Element|null {
        const { node, dispatch, renderTitle } = this.props;

        function handleClick(e: React.MouseEvent<HTMLDivElement>) {
            e.preventDefault();

            dispatch({
                type: actions.SELECT_NODE,
                node_id: node.get("id")
            });
        }

        const is_folder = inode.hasChildren(node);
        const is_open_folder = is_folder && node.get("is_open");
        const is_selected = node.get("is_selected");

        const li_classes = classNames({
            "banyan-common": true,
            "banyan-closed": is_folder && !node.get("is_open"),
            "banyan-folder": is_folder,
            "banyan-selected": is_selected
        });

        return (
            <li key={node.get("id")} className={li_classes}>
                <div className="banyan-element banyan-common" onClick={handleClick}>
                    <TreeTitle node={node} renderTitle={renderTitle} />
                    {is_folder ? <TreeButton node={node} dispatch={dispatch} /> : null}
                </div>
                {is_open_folder ? <TreeFolder node={node} dispatch={dispatch} renderTitle={renderTitle} /> : null}
            </li>
        );
    }

    public shouldComponentUpdate(nextProps: ITreeNodeProps): boolean {
        return nextProps.node !== this.props.node;
    }
}

interface ITreeFolderProps {
    node: Node;
    dispatch: Dispatch;
    renderTitle?: RenderNode;
}

function TreeFolder({ node, dispatch, renderTitle }: ITreeFolderProps) {
    const ul_classes = classNames({
        "banyan-common": true,
        "banyan-tree": node.get("is_root")
    });

    return (
        <ul className={ul_classes}>
            {inode.getChildren(node).map(
                (child: Node) => (
                    <TreeNode key={child.get("id")} node={child} dispatch={dispatch} renderTitle={renderTitle} />
                )
            )}
        </ul>
    );
}

interface ITreeTitleProps {
    node: Node;
    renderTitle?: RenderNode;
}

function TreeTitle({ node, renderTitle }: ITreeTitleProps) {
    const title_classes = classNames({
        "banyan-common": true,
        "banyan-title": true,
        "banyan-title-folder": inode.hasChildren(node)
    });

    return (
        <span className={title_classes}>
            {renderTitle ? renderTitle(node) : node.get("name")}
        </span>
    );
}

function TreeButton({ node, dispatch }: {node: Node, dispatch: Dispatch}) {
    function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
        e.preventDefault();

        dispatch({
            type: actions.TOGGLE_NODE,
            node_id: node.get("id")
        });
    }

    const button_classes = classNames({
        "banyan-common": true,
        "banyan-toggler": true,
        "banyan-closed": !node.get("is_open")
    });

    const button_char = node.get("is_open") ? "▼" : "►";

    return (
        <a href="#" className={button_classes} onClick={handleClick}>
            {button_char}
        </a>
    );
}

export interface ITreeComponentProps {
    tree: Tree;
    dispatch: Dispatch;
    renderTitle?: RenderNode;
}

export default function TreeComponent({ tree, dispatch, renderTitle }: ITreeComponentProps) {
    return <TreeFolder node={tree.root} dispatch={dispatch} renderTitle={renderTitle} />;
}
