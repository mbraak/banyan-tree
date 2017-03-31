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
    const tree_context: ITreeContext = { onToggleNode, onSelectNode, renderTitle };

    const tree_folder = <TreeFolder node={tree.root} tree_context={tree_context} renderTitle={renderTitle} />;

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

export interface ITreeComponentProps {
    tree: Tree;
    renderTitle?: RenderNode;
}

export interface ITreeComponentState {
    tree: Tree;
}

export class TreeComponent extends React.Component<ITreeComponentProps, ITreeComponentState> {
    constructor(props: ITreeComponentProps) {
        super(props);

        this.state = { tree: props.tree };

        this.handleToggle = this.handleToggle.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleKey = this.handleKey.bind(this);
    }

    public render(): JSX.Element {
        const { tree } = this.state;
        const { renderTitle } = this.props;

        return (
            <BaseTreeComponent
                tree={tree}
                renderTitle={renderTitle}
                onToggleNode={ this.handleToggle }
                onSelectNode={ this.handleSelect }
                onHandleKey={ this.handleKey }
            />
        );
    }

    private handleToggle(node: Node) {
        const { tree } = this.state;

        this.setState({
            tree: tree.toggleNode(node.get("id"))
        });
    }

    private handleSelect(node: Node) {
        const { tree } = this.state;

        this.setState({
            tree: tree.selectNode(node.get("id"))
        });
    }

    private handleKey(key: string) {
        const { tree } = this.state;

        this.setState({
            tree: tree.handleKey(key)
        });
    }
}
