
import Reflux from 'reflux';
import actions from './actions';


var tree_store = Reflux.createStore({
    listenables: actions,
});

export default tree_store;
