import React from "react";

import classNames from "classnames";

import { Tree } from "./immutable_tree";
import * as inode from "./immutable_node";
import { Node } from "./immutable_node";

export type RenderNode = (node: Node) => JSX.Element;

export type NodeCallback = (node: Node) => void;

interface ITreeContext {
    onToggleNode?: NodeCallback;
    onSelectNode?: NodeCallback;
    renderTitle?: RenderNode;
}

interface ITreeNodeProps {
    node: Node;
    tree_context: ITreeContext;
    renderTitle?: RenderNode;
}

class TreeNode extends React.Component<ITreeNodeProps, {}> {
    public render(): JSX.Element|null {
        const { node, tree_context, renderTitle } = this.props;

        function handleClick(e: React.MouseEvent<HTMLDivElement>) {
            e.preventDefault();

            if (tree_context.onSelectNode) {
                tree_context.onSelectNode(node);
            }
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
                    {is_folder ? <TreeButton node={node} onToggleNode={tree_context.onToggleNode} /> : null}
                </div>
                {is_open_folder
                    ? <TreeFolder node={node} tree_context={tree_context} renderTitle={renderTitle} />
                    : null
                }
            </li>
        );
    }

    public shouldComponentUpdate(nextProps: ITreeNodeProps): boolean {
        return nextProps.node !== this.props.node;
    }
}

interface ITreeFolderProps {
    node: Node;
    tree_context: ITreeContext;
    renderTitle?: RenderNode;
}

function TreeFolder({ node, tree_context, renderTitle }: ITreeFolderProps) {
    const ul_classes = classNames({
        "banyan-common": true,
        "banyan-tree": node.get("is_root")
    });

    return (
        <ul className={ul_classes}>
            {inode.getChildren(node).map(
                (child: Node) => (
                    <TreeNode
                        key={child.get("id")} node={child} tree_context={tree_context} renderTitle={renderTitle}
                    />
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

interface ITreeButtonProps {
    node: Node;
    onToggleNode?: NodeCallback;
}

function TreeButton({ node, onToggleNode }: ITreeButtonProps) {
    function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
        e.preventDefault();
        e.stopPropagation();

        if (onToggleNode) {
            onToggleNode(node);
        }
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
    onToggleNode?: NodeCallback;
    onSelectNode?: NodeCallback;
    renderTitle?: RenderNode;
}

export default function TreeComponent({ tree, onToggleNode, onSelectNode, renderTitle }: ITreeComponentProps) {
    const tree_context: ITreeContext = {
        onToggleNode, onSelectNode, renderTitle
    };

    return (
        <TreeFolder node={tree.root} tree_context={tree_context} renderTitle={renderTitle} />
    );
}
