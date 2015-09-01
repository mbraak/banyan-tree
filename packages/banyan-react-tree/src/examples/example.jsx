/* @flow */
import React from "react";

import App from "./app.jsx";

import {example_data} from "../testutil/example_data";


function onClickReload() {
    const new_data = [
        {name: "Tyrannosauroids", id: 9},
        {name: "Ornithomimosaurians", id: 10},
        {name: "Therizinosauroids", id: 11},
        {name: "Oviraptorosaurians", id: 12},
        {name: "Dromaeosaurids", id: 13},
        {name: "Troodontids", id: 14},
        {name: "Avialans", id: 15}
    ];

    renderApp(new_data);
}

function renderApp(data) {
    React.render(
        (
            <div>
                <p>
                    <a href="#" onClick={onClickReload}>load data</a>
                </p>
                <App data={data} />
            </div>
        ),
        document.getElementById("tree1")
    );
}

renderApp(example_data);
