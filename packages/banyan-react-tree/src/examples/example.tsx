import React from "react";
import ReactDOM from "react-dom";

import { createStore, combineReducers } from "redux";
import { Provider, connect } from "react-redux";

import App from "./app";
import { Tree } from "../immutable_tree";
import reduceTree from "../reducer";

import { example_data } from "../testutil/example_data";
import "../../css/banyan-react-tree.css";

const root_reducer = combineReducers({ tree: reduceTree });
const initial = { tree: new Tree(example_data) };

const store = createStore(root_reducer, initial);

const ConnectedApp = connect(state => state)(App);

ReactDOM.render(
    (
        <Provider store={store}>
            <ConnectedApp />
        </Provider>
    ),
    document.getElementById("tree1")
);
