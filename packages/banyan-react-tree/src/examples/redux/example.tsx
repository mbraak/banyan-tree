import React from "react";
import ReactDOM from "react-dom";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider, connect } from "react-redux";
import logger from "redux-logger";

import App from "./app";
import reduceTree from "../../redux/reducer";
import { Tree } from "../../immutable_tree";
import example_data from "../dinosaurs.json";

import "../../../css/banyan-react-tree.css";
import "../example.css";

const tree = new Tree([example_data])
    .openLevel(1);

const initial = { tree };
const root_reducer = combineReducers({ tree: reduceTree });
const store = createStore(
    root_reducer,
    initial,
    applyMiddleware(logger)
);

const ConnectedApp = connect(state => state)(App);

ReactDOM.render(
    (
        <Provider store={store}>
            <ConnectedApp />
        </Provider>
    ),
    document.getElementById("tree1")
);
