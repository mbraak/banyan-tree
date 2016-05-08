/* @flow */
import React from "react";

import { TreeStore } from "./tree_store";
import { Tree } from "./tree_node";
import TreeFolderComponent from "./tree_folder_component";

import type TreeController from "./tree_controller";


function isActiveElementAnInput(): boolean {
    const tag_name = document.activeElement && document.activeElement.tagName.toLowerCase();

    return tag_name === "input" || tag_name === "textarea" || tag_name === "select";
}


export default class TreeComponent extends React.Component {
    props: {
        autoOpen: boolean | number,
        controller: TreeController,
        data: Array<Object>,
        debug: boolean,
        dragAndDrop: boolean,
        keyboardSupport: boolean,
        onError: () => void,
        onInit: () => void,
        saveState: boolean,
        url: string
    };

    state: {
        store: TreeStore
    };

    static defaultProps = {
        autoOpen: false,
        debug: false,
        dragAndDrop: false,
        keyboardSupport: true
    };

    constructor(props: Object) {
        super(props);

        this.state = { store: this.createStore() };
    }

    createStore(): TreeStore {
        return new TreeStore({
            data: this.props.data,
            url: this.props.url,
            auto_open: this.props.autoOpen,
            controller: this.props.controller,
            debug: this.props.debug,
            drag_and_drop: this.props.dragAndDrop,
            save_state: this.props.saveState,
            keyboard_support: this.props.keyboardSupport,
            on_change: this.forceUpdate.bind(this),
            on_init: this.props.onInit,
            on_error: this.props.onError
        });
    }

    // - public functions
    getTree(): Tree {
        return this.getStore().tree;
    }

    getStore(): TreeStore {
        return this.state.store;
    }

    // - react functions
    render() {
        const store = this.state.store;

        return (
            <TreeFolderComponent node={store.tree} store={store} />
        );
    }

    componentDidMount() {
        // todo: keyboard mixin?
        document.addEventListener("keydown", this.handleKeyDown.bind(this));
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyDown.bind(this));
    }

    // - event handlers
    handleKeyDown(e: any) {
        // todo: use KeyboardEvent
        if (!isActiveElementAnInput()) {
            // todo: keyIdentifier is deprecated
            this.getStore().handleKeyDown(e.keyIdentifier);
        }
    }
}
