import React from "react";

export abstract class BaseKeyHandler<T> extends React.Component<T, void> {
    constructor(props: any) {
        super(props);

        this.handleKey = this.handleKey.bind(this);
    }

    public componentDidMount() {
        window.addEventListener("keydown", this.handleKey);
    }

    public componentWillUnmount() {
        window.removeEventListener("keydown", this.handleKey);
    }

    public render() {
        return React.Children.only(this.props.children);
    }

    protected abstract handleKey(event: KeyboardEvent): void;
}

export type HandleKey = (key: string) => boolean;

export interface IKeyHandlerProps {
    onHandleKey: HandleKey;
}

export default class KeyHandler extends BaseKeyHandler<IKeyHandlerProps> {
    private tree_element?: Element;

    public setTreeElement(element: Element) {
        this.tree_element = element;
    }

    protected handleKey(event: KeyboardEvent) {
        const { key } = event;

        if (this.canHandleKeyboard(key)) {
            const is_handled = this.props.onHandleKey(key);

            if (is_handled) {
                event.preventDefault();
            }
        }
    }

    private canHandleKeyboard(key: string): boolean {
        return (
            this.isArrowKey(key),
            this.isFocusOnTree()
        );
    }

    private isArrowKey(key: string): boolean {
        return key === "ArrowUp" || key === "ArrowDown" || key === "ArrowLeft" || key === "ArrowRight";
    }

    private isFocusOnTree(): boolean {
        const active_element = document.activeElement;

        return (
            active_element != null &&
            this.tree_element != null &&
            isParentOf(this.tree_element, active_element as any)
        );
    }
}

function isParentOf(parent: Element, child: HTMLElement): boolean {
    let current_parent = child.parentElement;

    while (current_parent) {
        if (current_parent === parent) {
            return true;
        }

        current_parent = current_parent.parentElement;
    }

    return false;
}
