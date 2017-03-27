import React from "react";
import ReactDOM from "react-dom";

import { createStore, combineReducers } from "redux";
import { Provider, connect } from "react-redux";

import App from "./app";
import { Tree } from "../immutable_tree";
import reduceTree from "../redux/reducer";
import example_data from "./dinosaurs.json";

import "../../css/banyan-react-tree.css";
import "./example.css";

const root_reducer = combineReducers({ tree: reduceTree });
const tree = new Tree([example_data])
    .openLevel(1);

const initial = { tree };

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
