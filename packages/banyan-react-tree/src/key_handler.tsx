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

export type HandleKey = (key: string) => void;

export interface IKeyHandlerProps {
    onHandleKey: HandleKey;
};

export default class KeyHandler extends BaseKeyHandler<IKeyHandlerProps> {
    protected handleKey(event: KeyboardEvent) {
        const { key } = event;

        if (key === "ArrowUp" || key === "ArrowDown" || key === "ArrowLeft" || key === "ArrowRight") {
            this.props.onHandleKey(key);
        }
    }
}
