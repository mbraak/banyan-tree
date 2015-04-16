]import React from "react";
import Fluxxor from "fluxxor";

import TreeStore from "./store";


var actions = {
    selectNode: function(node_id) {
        this.dispatch("SELECT", node_id);
    }
};

var stores = {
    TreeStore: new TreeStore()
};

var flux = new Fluxxor.Flux(stores, actions);


class FluxComponent extends React.Component {
    componentDidMount() {
        
    }
}


export default class Tree extends FluxComponent {

}
