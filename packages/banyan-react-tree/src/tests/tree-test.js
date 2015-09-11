import {expect} from 'chai';

import React, {findDOMNode} from 'react';
import TestUtils from 'react/lib/ReactTestUtils';

import {example_data} from '../testutil/example_data';

import {fakeServer, fakeServerWithLoadOnDemand, fakeServerWithError} from '../testutil/fake_server';

import {format_list} from '../testutil/format';
import Tree from '../tree.js';


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
            var dom_node = findDOMNode(tree_element);

            expect(dom_node.className).to.equal('banyan_common banyan-tree');
            expect(dom_node.children.length).to.equal(0);
        }
    });

    it('renders second level of a tree', function() {
        var tree_element = TestUtils.renderIntoDocument(<Tree data={example_data} autoOpen={2} onInit={handleInit}></Tree>);

        function handleInit() {
            var dom_node = findDOMNode(tree_element);
            var dom_elements = dom_node.getElementsByClassName('banyan-title');

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

                // find nodes with class 'banyan-selected'
                var dom_node = findDOMNode(tree_element);
                var dom_elements = dom_node.getElementsByClassName('banyan-selected');

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
                var dom_node = findDOMNode(tree_element);
                var dom_elements = dom_node.getElementsByClassName('banyan-title');

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

        localStorage.removeItem('banyan');

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

        localStorage.setItem('banyan', JSON.stringify(tree_state));

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

    it('can select a node by clicking on it', function(done) {
        var tree_element = TestUtils.renderIntoDocument(<Tree data={example_data} autoOpen={true} onInit={handleInit}></Tree>);

        function handleInit() {
            try {
                // select node at first level
                TestUtils.Simulate.click(
                    findTitleNodeByName(tree_element, "Ornithischians")
                );

                var li = findTitleNodeByName(tree_element, "Ornithischians").parentNode.parentNode;
                expect(li.classList.contains("banyan-selected")).to.equal(true);

                // select node at lower level
                TestUtils.Simulate.click(
                    findTitleNodeByName(tree_element, "Herrerasaurians")
                );

                li = findTitleNodeByName(tree_element, "Herrerasaurians").parentNode.parentNode;
                expect(li.classList.contains("banyan-selected")).to.equal(true);

                done();
            }
            catch(err) {
                done(err);
            }
        }
    });
});


function findTitleNodeByName(tree_element, name) {
    return Array.prototype.find.call(
        findDOMNode(tree_element).getElementsByClassName('banyan-title'),
        el => el.innerHTML == name
    );
}

function format_dom_elements(dom_elements) {
    var labels = [];

    for (var i=0; i < dom_elements.length; i++) {
        labels.push(dom_elements[i].textContent);
    }

    return format_list(labels);
}
