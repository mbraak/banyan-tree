import Fluxxor from "fluxxor";


var TreeStore = Fluxxor.createStore({
    actions: {
        "SELECT": "handleSelect"
    },

    handleSelect: function(payload, type) {
        //
    }
});

export default TreeStore;
