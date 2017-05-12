export interface ITreeProxy {
    getElement(): Element | undefined;
}
export declare class Plugin {
    protected tree_proxy?: ITreeProxy;
    setTreeProxy(tree_proxy: ITreeProxy): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
}
