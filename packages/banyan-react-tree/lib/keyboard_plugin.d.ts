import { Plugin } from "./plugin";
export declare type HandleKey = (key: string) => boolean;
export declare class KeyboardPlugin extends Plugin {
    private onHandleKey?;
    constructor(onHandleKey?: HandleKey);
    componentDidMount(): void;
    componentWillUnmount(): void;
    protected handleKey(event: KeyboardEvent): void;
    private canHandleKeyboard(key);
    private isArrowKey(key);
    private isFocusOnTree();
}
