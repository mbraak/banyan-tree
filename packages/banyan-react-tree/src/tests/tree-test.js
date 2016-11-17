/* eslint-env mocha */
import { expect } from "chai";

import React from "react";
import { findDOMNode } from "react-dom";
import TestUtils from "react-addons-test-utils";

import { example_data } from "../testutil/example_data";

import { fakeServer, fakeServerWithLoadOnDemand, fakeServerWithError } from "../testutil/fake_server";

import { format_list } from "../testutil/format";
import Tree from "../tree";


/* eslint-disable no-var */
var server = null;
/* eslint-enable no-var */


beforeEach(() => {
    server = null;
});

afterEach(() => {
    if (server) {
        server.restore();
    }
});


function findTitleNodeByName(tree_element, name) {
    return Array.prototype.find.call(
        findDOMNode(tree_element).getElementsByClassName("banyan-title"),
        el => el.innerHTML === name
    );
}

function format_dom_elements(dom_elements) {
    return format_list(
        Array.from(dom_elements)
            .map(el => el.textContent)
    );
}


describe("Tree component", () => {
    it("renders an empty tree", () => {
        const tree_element = TestUtils.renderIntoDocument(<Tree onInit={handleInit} />);

        function handleInit() {
            const dom_node = findDOMNode(tree_element);

            expect(dom_node.className).to.equal("banyan-common banyan-tree");
            expect(dom_node.children.length).to.equal(0);
        }
    });

    it("renders second level of a tree", () => {
        const tree_element = TestUtils.renderIntoDocument(<Tree data={example_data} autoOpen={2} onInit={handleInit} />);

        function handleInit() {
            const dom_node = findDOMNode(tree_element);
            const dom_elements = dom_node.getElementsByClassName("banyan-title");

            expect(format_dom_elements(dom_elements)).to.equal(
                "Saurischia Herrerasaurians Theropods Sauropodomorphs Ornithischians Heterodontosaurids Thyreophorans Ornithopods Pachycephalosaurians Ceratopsians"
            );
        }
    });

    it("renders a selected node", (done) => {
        // render tree
        const tree_element = TestUtils.renderIntoDocument(<Tree data={example_data} autoOpen={true} onInit={handleInit} />);

        const tree_store = tree_element.getStore();
        const tree = tree_store.tree;

        function handleInit() {
            try {
                // select node
                const node = tree.getNodeByName("Tyrannosauroids");
                tree_store.selectNode(node);

                // find nodes with class 'banyan-selected'
                const dom_node = findDOMNode(tree_element);
                const dom_elements = dom_node.getElementsByClassName("banyan-selected");

                expect(format_dom_elements(dom_elements)).to.equal("Tyrannosauroids");

                done();
            }
            catch (err) {
                done(err);
            }
        }
    });

    it("loads data from a url", (done) => {
        server = fakeServer();

        function handleInit() {
            try {
                const dom_node = findDOMNode(tree_element);
                const dom_elements = dom_node.getElementsByClassName("banyan-title");

                expect(dom_elements.length).to.equal(31);
                expect(dom_elements[0].textContent).to.equal("Saurischia");

                done();
            }
            catch (err) {
                done(err);
            }
        }

        const tree_element = TestUtils.renderIntoDocument(<Tree url="/data" autoOpen={true} onInit={handleInit} />);
    });

    it("fires the onError event", (done) => {
        server = fakeServerWithError();

        function handleError() {
            done();
        }

        TestUtils.renderIntoDocument(<Tree url="/examples/error/" onError={handleError} />);
    });

    it("saves the state", (done) => {
        server = fakeServer();

        function firstTree() {
            const tree_element = TestUtils.renderIntoDocument(<Tree url="/examples/data/" saveState={true} onInit={handleInit} />);
            const store = tree_element.getStore();

            function handleInit() {
                try {
                    store.openNode(store.tree.getNodeByName("Sauropods"));
                    store.selectNode(store.tree.getNodeByName("Prosauropods"));

                    secondTree();
                }
                catch (err) {
                    done(err);
                }
            }
        }

        function secondTree() {
            let store;

            function handleInit() {
                try {
                    const tree_state = store.tree.getState();

                    expect(tree_state).to.deep.equal({
                        open: [
                            { id: 18, parents: [16, 1] }
                        ],
                        selected: [
                            { id: 17, parents: [16, 1] }
                        ]
                    });

                    done();
                }
                catch (err) {
                    done(err);
                }
            }

            try {
                const tree_element = TestUtils.renderIntoDocument(<Tree url="/examples/data/" saveState={true} onInit={handleInit} />);
                store = tree_element.getStore();
            }
            catch (err) {
                done(err);
            }
        }

        localStorage.removeItem("banyan");

        firstTree();
    });

    it("restores state with loadondemand", (done) => {
        server = fakeServerWithLoadOnDemand();

        const tree_state = {
            open: [
                { id: 18, parents: [16, 1] }
            ],
            selected: [
                { id: 17, parents: [16, 1] }
            ]
        };

        localStorage.setItem("banyan", JSON.stringify(tree_state));

        const tree_element = TestUtils.renderIntoDocument(<Tree url="/examples/data/" saveState={true} onInit={handleInit} />);
        const store = tree_element.getStore();

        function handleInit() {
            try {
                const sauropods = store.tree.getNodeByName("Sauropods");
                expect(sauropods).not.to.equal(null);

                expect(sauropods.is_open).to.equal(true);
                expect(store.tree.getNodeByName("Prosauropods").is_selected).to.equal(true);

                done();
            }
            catch (err) {
                done(err);
            }
        }
    });

    it("can select a node by clicking on it", (done) => {
        const tree_element = TestUtils.renderIntoDocument(<Tree data={example_data} autoOpen={true} onInit={handleInit} />);

        function handleInit() {
            try {
                // select node at first level
                TestUtils.Simulate.click(
                    findTitleNodeByName(tree_element, "Ornithischians")
                );

                let li = findTitleNodeByName(tree_element, "Ornithischians").parentNode.parentNode;
                expect(li.classList.contains("banyan-selected")).to.equal(true);

                // select node at lower level
                TestUtils.Simulate.click(
                    findTitleNodeByName(tree_element, "Herrerasaurians")
                );

                li = findTitleNodeByName(tree_element, "Herrerasaurians").parentNode.parentNode;
                expect(li.classList.contains("banyan-selected")).to.equal(true);

                done();
            }
            catch (err) {
                done(err);
            }
        }
    });
});
