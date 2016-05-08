/* @flow */
// $FlowFixMe
import "../../css/banyan-react-tree.css";

import React from "react";
import ReactDOM from "react-dom";

import App from "./app";

import { example_data } from "../testutil/example_data";


function onClickReload() {
    const new_data = [
        { name: "Tyrannosauroids", id: 9 },
        { name: "Ornithomimosaurians", id: 10 },
        { name: "Therizinosauroids", id: 11 },
        { name: "Oviraptorosaurians", id: 12 },
        { name: "Dromaeosaurids", id: 13 },
        { name: "Troodontids", id: 14 },
        { name: "Avialans", id: 15 }
    ];

    renderApp(new_data);
}

function renderApp(data) {
    ReactDOM.render(
        <div>
            <p>
                <a href="#" onClick={onClickReload}>load data</a>
            </p>
            <App data={data} />
        </div>,
        document.getElementById("tree1")
    );
}

renderApp(example_data);
