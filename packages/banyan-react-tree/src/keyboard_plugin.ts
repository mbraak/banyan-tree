import { Plugin } from "./plugin";

export type HandleKey = (key: string) => boolean;

export class KeyboardPlugin extends Plugin {
    private onHandleKey?: HandleKey;

    constructor(onHandleKey?: HandleKey) {
        super();

        this.onHandleKey = onHandleKey;
    }

    public componentDidMount() {
        window.addEventListener("keydown", this.handleKey);
    }

    public componentWillUnmount() {
        window.removeEventListener("keydown", this.handleKey);
    }

    protected handleKey = (event: KeyboardEvent): void => {
        const { key } = event;
        const onHandleKey = this.onHandleKey;

        if (this.canHandleKeyboard(key) && onHandleKey) {
            const isHandled = onHandleKey(key);

            if (isHandled) {
                event.preventDefault();
            }
        }
    };

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
        const activeElement = document.activeElement;
        const treeElement = this.tree_proxy && this.tree_proxy.getElement();

        return (
            activeElement != null &&
            treeElement != null &&
            isParentOf(treeElement, activeElement as any)
        );
    }
}

const isParentOf = (parent: Element, child: HTMLElement): boolean => {
    let currentParent = child.parentElement;

    while (currentParent) {
        if (currentParent === parent) {
            return true;
        }

        currentParent = currentParent.parentElement;
    }

    return false;
};
