import { Plugin } from "./plugin";

export type HandleKey = (key: string) => boolean;

export class KeyboardPlugin extends Plugin {
    private onHandleKey?: HandleKey;

    constructor(onHandleKey?: HandleKey) {
        super();

        this.onHandleKey = onHandleKey;

        this.handleKey = this.handleKey.bind(this);
    }

    public componentDidMount() {
        window.addEventListener("keydown", this.handleKey);
    }

    public componentWillUnmount() {
        window.removeEventListener("keydown", this.handleKey);
    }

    protected handleKey(event: KeyboardEvent) {
        const { key } = event;
        const onHandleKey = this.onHandleKey;

        if (this.canHandleKeyboard(key) && onHandleKey) {
            const is_handled = onHandleKey(key);

            if (is_handled) {
                event.preventDefault();
            }
        }
    }

    private canHandleKeyboard(key: string): boolean {
        return this.isArrowKey(key) && this.isFocusOnTree();
    }

    private isArrowKey(key: string): boolean {
        return (
            key === "ArrowUp" ||
            key === "ArrowDown" ||
            key === "ArrowLeft" ||
            key === "ArrowRight"
        );
    }

    private isFocusOnTree(): boolean {
        const active_element = document.activeElement;
        const tree_element = this.tree_proxy && this.tree_proxy.getElement();

        return (
            active_element != null &&
            tree_element != null &&
            isParentOf(tree_element, active_element as any)
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
