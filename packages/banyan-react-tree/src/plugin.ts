export interface ITreeProxy {
    getElement(): Element | undefined;
}

export class Plugin {
    protected tree_proxy?: ITreeProxy;

    public setTreeProxy(tree_proxy: ITreeProxy) {
        this.tree_proxy = tree_proxy;
    }

    public componentDidMount() {
        //
    }

    public componentWillUnmount() {
        //
    }
}
