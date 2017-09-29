import React from "react";
import ReactDOM from "react-dom";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider, connect } from "react-redux";
import logger from "redux-logger";
import { Tree } from "banyan-immutable-tree/lib/immutable_tree";
import { example_data } from "dinosaur-data";

import App from "./app";
import { createReducerForTreeId } from "../../src/redux/reducer";

import "../../css/banyan-react-tree.css";
import "../example.css";

const tree = new Tree([example_data]).openLevel(1);

const initial = { tree };
const root_reducer = combineReducers({
    tree: createReducerForTreeId("example")
});
const store = createStore(root_reducer, initial, applyMiddleware(logger));

const ConnectedApp: any = connect(state => state)(App);

ReactDOM.render(
    <Provider store={store}>
        <ConnectedApp />
    </Provider>,
    document.getElementById("tree1")
);
