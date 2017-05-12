import React from "react";

import { Tree } from "./immutable_tree";
import { BaseTreeComponent, RenderNode } from "./base_tree_component";
import { Node } from "./immutable_node";
import { KeyboardPlugin } from "./keyboard_plugin";

export interface ITreeComponentProps {
    tree: Tree;
    renderTitle?: RenderNode;
    keyboardSupport?: boolean;
}

export interface ITreeComponentState {
    tree: Tree;
}

export class TreeComponent extends React.Component<ITreeComponentProps, ITreeComponentState> {
    public static defaultProps: Partial<ITreeComponentProps> = {
        keyboardSupport: true
    };

    constructor(props: ITreeComponentProps) {
        super(props);

        this.state = { tree: props.tree };

        this.handleToggle = this.handleToggle.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleKey = this.handleKey.bind(this);
    }

    public render(): JSX.Element {
        const { tree } = this.state;
        const { renderTitle, keyboardSupport } = this.props;

        const createKeyboardPlugin = () => (
            new KeyboardPlugin(this.handleKey)
        );

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

    private handleKey(key: string): boolean {
        const { tree } = this.state;

        const [ is_handled, new_tree ] = tree.handleKey(key);

        if (!is_handled) {
            return false;
        }
        else {
            this.setState({ tree: new_tree });
            return true;
        }
    }
}
