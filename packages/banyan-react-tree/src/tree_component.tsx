import * as React from "react";
import { Component } from "react";
import { Tree } from "@banyan/immutable-tree/lib/immutable_tree";
import { Node } from "@banyan/immutable-tree/lib/immutable_node";

import { BaseTreeComponent, RenderNode } from "./base_tree_component";
import { KeyboardPlugin } from "./keyboard_plugin";

export interface ITreeComponentProps {
    tree: Tree;
    renderTitle?: RenderNode;
    keyboardSupport?: boolean;
}

export interface ITreeComponentState {
    tree: Tree;
}

export class TreeComponent extends Component<
    ITreeComponentProps,
    ITreeComponentState
> {
    public static defaultProps: Partial<ITreeComponentProps> = {
        keyboardSupport: true
    };

    constructor(props: ITreeComponentProps) {
        super(props);

        this.state = { tree: props.tree };
    }

    public render(): JSX.Element {
        const { tree } = this.state;
        const { renderTitle, keyboardSupport } = this.props;

        const createKeyboardPlugin = () => new KeyboardPlugin(this.handleKey);

        const plugins = keyboardSupport ? [createKeyboardPlugin()] : [];

        const props = {
            tree,
            renderTitle,
            onToggleNode: this.handleToggle,
            onSelectNode: this.handleSelect,
            plugins
        };

        return <BaseTreeComponent {...props} />;
    }

    private handleToggle = (node: Node): void => {
        const { tree } = this.state;

        this.setState({
            tree: tree.toggleNode(node.get("id"))
        });
    };

    private handleSelect = (node: Node): void => {
        const { tree } = this.state;

        this.setState({
            tree: tree.selectNode(node.get("id"))
        });
    };

    private handleKey = (key: string): boolean => {
        const { tree } = this.state;

        const [isHandled, newTree] = tree.handleKey(key);

        if (!isHandled) {
            return false;
        } else {
            this.setState({ tree: newTree });
            return true;
        }
    };
}
