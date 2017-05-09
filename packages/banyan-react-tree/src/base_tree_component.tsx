import React from "react";

import classNames from "classnames";

import { Tree } from "./immutable_tree";
import * as inode from "./immutable_node";
import { Node } from "./immutable_node";
import KeyHandler, { HandleKey } from "./key_handler";

export type RenderNode = (node: Node) => JSX.Element;

export type NodeCallback = (node: Node) => void;

interface ITreeContext {
    onToggleNode?: NodeCallback;
    onSelectNode?: NodeCallback;
    renderTitle: RenderNode;
}

interface ITreeNodeProps {
    node: Node;
    tree_context: ITreeContext;
}

class TreeNode extends React.Component<ITreeNodeProps, {}> {
    public render(): JSX.Element|null {
        const { node, tree_context } = this.props;
        const { renderTitle } = tree_context;

        function handleClick(e: React.MouseEvent<HTMLDivElement>) {
            if ((e.target as any).tagName !== "A") {
                e.preventDefault();

                if (tree_context.onSelectNode) {
                    tree_context.onSelectNode(node);
                }
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
            <li key={node.get("id")} className={li_classes} role="presentation">
                <div className="banyan-element banyan-common" onClick={handleClick} role="presentation">
                    <TreeTitle node={node} renderTitle={renderTitle} />
                    {is_folder ? <TreeButton node={node} onToggleNode={tree_context.onToggleNode} /> : null}
                </div>
                {is_open_folder
                    ? <TreeFolder node={node} tree_context={tree_context} />
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
}

function TreeFolder({ node, tree_context }: ITreeFolderProps) {
    const is_root = node.get("is_root");

    const ul_classes = classNames({
        "banyan-common": true,
        "banyan-tree": is_root
    });

    const role = is_root ? "tree" : "node";

    return (
        <ul className={ul_classes} role={role}>
            {inode.getChildren(node).map(
                (child: Node) => (
                    <TreeNode
                        key={child.get("id")} node={child} tree_context={tree_context}
                    />
                )
            )}
        </ul>
    );
}

interface ITreeTitleProps {
    node: Node;
    renderTitle: RenderNode;
}

function TreeTitle({ node, renderTitle }: ITreeTitleProps) {
    const title_classes = classNames({
        "banyan-common": true,
        "banyan-title": true,
        "banyan-title-folder": inode.hasChildren(node)
    });

    const is_selected = node.get("is_selected");

    const node_title = renderTitle(node);
    const tabindex = is_selected ? 0 : -1;
    const is_open = node.get("is_open");

    const props = {
        "className": title_classes,
        "tabIndex": tabindex,
        "role": "treeitem",
        "aria-selected": is_selected,
        "aria-expanded": is_open
    };

    // todo: aria-level

    return (
        <span {...props}>
            { node_title }
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

    const props = {
        "className": button_classes,
        "onClick": handleClick,
        "role": "presentation",
        "aria-hidden": true,
        "tabIndex": -1
    };

    return (
        <a href="#" {...props}>
            {button_char}
        </a>
    );
}

const defaultRenderTitle = (node: Node) => node.get("name");

export interface IBaseTreeComponentProps {
    tree: Tree;
    onToggleNode?: NodeCallback;
    onSelectNode?: NodeCallback;
    renderTitle?: RenderNode;
    onHandleKey?: HandleKey;
}

export function BaseTreeComponent(
    { tree, onToggleNode, onSelectNode, renderTitle, onHandleKey }: IBaseTreeComponentProps
) {
    const tree_context: ITreeContext = {
        onToggleNode,
        onSelectNode,
        renderTitle: renderTitle || defaultRenderTitle
    };

    const tree_folder = <TreeFolder node={tree.root} tree_context={tree_context} />;

    if (!onHandleKey) {
        return tree_folder;
    }
    else {
        return (
            <KeyHandler onHandleKey={onHandleKey}>
                {tree_folder}
            </KeyHandler>
        );
    }
}
