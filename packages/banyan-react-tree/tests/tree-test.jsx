import {expect} from 'chai';

import React from 'react/addons';

import {example_data} from '../src/testutil/example_data';

import {fakeServer, fakeServerWithLoadOnDemand, fakeServerWithError} from '../src/testutil/fake_server';

import {format_list} from '../src/testutil/format';
import Tree from '../src/tree.jsx';

var TestUtils = React.addons.TestUtils;


var server = null;

beforeEach(function() {
    server = null;
});

afterEach(function() {
    if (server) {
        server.restore();
    }
});


describe('Tree component', function() {
    it('renders an empty tree', function() {
        var tree_element = TestUtils.renderIntoDocument(<Tree onInit={handleInit}></Tree>);

        function handleInit() {
            var dom_node = React.findDOMNode(tree);

            expect(dom_node.className).to.equal('jqtree_common jqtree-tree');
            expect(dom_node.children.length).to.equal(0);
        }
    });

    it('renders second level of a tree', function() {
        var tree_element = TestUtils.renderIntoDocument(<Tree data={example_data} autoOpen={2} onInit={handleInit}></Tree>);

        function handleInit() {
            var dom_node = React.findDOMNode(tree);
            var dom_elements = dom_node.getElementsByClassName('jqtree-title');

            expect(format_dom_elements(dom_elements)).to.equal(
                'Saurischia Herrerasaurians Theropods Sauropodomorphs Ornithischians Heterodontosaurids Thyreophorans Ornithopods Pachycephalosaurians Ceratopsians'
            );
        }
    });

    it('renders a selected node', function(done) {
        // render tree
        var tree_element = TestUtils.renderIntoDocument(<Tree data={example_data} autoOpen={true} onInit={handleInit}></Tree>);

        var tree_store = tree_element.getStore();
        var tree = tree_store.tree;

        function handleInit() {
            try {
                // select node
                var node = tree.getNodeByName('Tyrannosauroids');
                tree_store.selectNode(node);

                // find nodes with class 'jqtree-selected'
                var dom_node = React.findDOMNode(tree_element);
                var dom_elements = dom_node.getElementsByClassName('jqtree-selected');

                expect(format_dom_elements(dom_elements)).to.equal('Tyrannosauroids');

                done();
            }
            catch(err) {
                done(err);
            }
        }
    });

    it('loads data from a url', function(done) {
        server = fakeServer();

        function handleInit() {
            try {
                var dom_node = React.findDOMNode(tree_element);
                var dom_elements = dom_node.getElementsByClassName('jqtree-title');

                expect(dom_elements.length).to.equal(31);
                expect(dom_elements[0].textContent).to.equal('Saurischia');

                done();
            }
            catch(err) {
                done(err);
            }
        }

        var tree_element = TestUtils.renderIntoDocument(<Tree url='/data' autoOpen={true} onInit={handleInit}></Tree>);
    });

    it('fires the onError event', function(done) {
        server = fakeServerWithError();

        function handleError() {
            done();
        }

        var tree_element = TestUtils.renderIntoDocument(<Tree url='/examples/data/' onError={handleError}></Tree>);
    });

    it('saves the state', function(done) {
        server = fakeServer();

        function firstTree() {
            function handleInit() {
                try {
                    store.openNode(store.tree.getNodeByName('Sauropods'));
                    store.selectNode(store.tree.getNodeByName('Prosauropods'));

                    secondTree();
                }
                catch(err) {
                    done(err);
                }
            }

            var tree_element = TestUtils.renderIntoDocument(<Tree url='/examples/data/' saveState={true} onInit={handleInit}></Tree>);
            var store = tree_element.getStore();
        }

        function secondTree() {
            function handleInit() {
                try {
                    var tree_state = store.tree.getState();

                    expect(tree_state).to.deep.equal({
                        open: [
                            {id: 18, parents: [16, 1]}
                        ],
                        selected: [
                            {id: 17, parents: [16, 1]}
                        ]
                    });

                    done();
                }
                catch(err) {
                    done(err);
                }
            }

            try {
                var tree_element = TestUtils.renderIntoDocument(<Tree url='/examples/data/' saveState={true} onInit={handleInit}></Tree>);
                var store = tree_element.getStore();
            }
            catch(err) {
                done(err);
            }
        }

        localStorage.removeItem('jqtree');

        firstTree();
    });

    it('restores state with loadondemand', function(done) {
        server = fakeServerWithLoadOnDemand();

        var tree_state = {
            open: [
                {id: 18, parents: [16, 1]}
            ],
            selected: [
                {id: 17, parents: [16, 1]}
            ]
        };

        localStorage.setItem('jqtree', JSON.stringify(tree_state));

        var tree_element = TestUtils.renderIntoDocument(<Tree url='/examples/data/' saveState={true} onInit={handleInit}></Tree>);
        var store = tree_element.getStore();

        function handleInit() {
            try {
                expect(store.tree.getNodeByName('Sauropods').is_open).to.equal(true);
                expect(store.tree.getNodeByName('Prosauropods').is_selected).to.equal(true);

                done();
            }
            catch (err) {
                done(err);
            }
        }
    });
});


function format_dom_elements(dom_elements) {
    var labels = [];

    for (var i=0; i < dom_elements.length; i++) {
        labels.push(dom_elements[i].textContent);
    }

    return format_list(labels);
}