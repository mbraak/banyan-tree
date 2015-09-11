import {expect} from 'chai';

import {fakeServer, fakeServerWithLoadOnDemand} from '../testutil/fake_server';

import {Tree, Node} from '../tree_node';
import {Position} from '../position';

import {LazyIterator} from '../lazy_iterator';

import {format_list_with_max}  from '../testutil/format';
import {example_data} from '../testutil/example_data';

import {format_nodes} from '../testutil/format_nodes';


var server = null;

beforeEach(function() {
    server = null;
});

afterEach(function() {
    if (server) {
        server.restore();
    }
});


describe('Tree', function() {

    it('loads data', function() {
        var tree = new Tree();
        tree.loadFromData(example_data);

        expect(format_nodes(tree.children)).to.equal('Saurischia Ornithischians');

        expect(format_nodes(tree.children[0].children)).to.equal('Herrerasaurians Theropods Sauropodomorphs');
    });

    it('adds a child node', function() {
        var tree = new Tree();

        var child = new Node({name: 'abc', id: 1});
        tree.addChild(child);
        expect(child.name).to.equal('abc');

        expect(format_nodes(tree.children)).to.equal('abc');
    });

    it('adds a child at a position', function() {
        var tree = new Tree();

        tree.addChild(new Node({name: 'abc', id: 1}));
        tree.addChild(new Node({name: 'ghi', id: 2}));

        var child = new Node({name: 'def', id: 3});
        tree.addChildAtPosition(child, 1);

        expect(child.name).to.equal('def');

        expect(format_nodes(tree.children)).to.equal('abc def ghi');
    });

    it('removes a child', function() {
        var tree = new Tree();

        var child = new Node({name: 'abc', id: 1});
        tree.addChild(child);

        tree.removeChild(child);

        expect(tree.children.length).to.equal(0);
    });

    it('gets the index of a child', function() {
        var tree = new Tree();

        tree.addChild(new Node({name: 'abc', id: 1}));

        var node_def = new Node({name: 'def', id: 2});
        tree.addChild(node_def);
        tree.addChild(new Node({name: 'ghi', id: 3}));

        expect(tree.getChildIndex(node_def)).to.equal(1);
    });

    it('gets a node by id', function() {
        var tree = new Tree();
        tree.loadFromData(example_data);

        var node = tree.getNodeById(15);
        expect(node).not.to.be.null;

        if (node) {
            expect(node.name).to.equal('Avialans');
        }
    });

    it('moves a node', function() {
        var tree = new Tree();
        tree.loadFromData(example_data);

        var troodontids = tree.getNodeById(14);
        var macronarians = tree.getNodeById(20);

        expect(macronarians).not.to.be.null;
        expect(format_nodes(macronarians.children)).to.equal('Brachiosaurids Titanosaurians');

        if (macronarians) {
            tree.moveNode(troodontids, macronarians, Position.INSIDE);

            expect(format_nodes(macronarians.children)).to.equal('Troodontids Brachiosaurids Titanosaurians');
        }
    });

    it('gets the previous sibling', function() {
        var tree = new Tree();
        tree.loadFromData(example_data);

        var sauropodomorphs = tree.getNodeById(16);
        expect(sauropodomorphs).not.to.be.null;

        if (sauropodomorphs) {
            var previous = sauropodomorphs.getPreviousSibling();

            expect(previous).not.to.be.null;

            if (previous) {
                expect(previous.name).to.equal('Theropods');
            }
        }
    });

    it('iterates', function() {
        var tree = new Tree();
        tree.loadFromData(example_data);

        // iterate first level
        var node_names = [];

        tree.iterate(function(node, level) {
            node_names.push(node.name);
            return level == 1;
        });

        expect(node_names.length).to.equal(10);
        expect(
            format_list_with_max(node_names, 3)
        ).to.equal('Saurischia Herrerasaurians Theropods');
    });

    it('iterates lazily', function(done) {
        var tree = new Tree();

        var node_names = [];

        function mustContinue(node, level) {
            node_names.push(node.name);
            return true;
        }

        function checkResult() {
            try {
                expect(node_names.length).to.equal(31);
                expect(
                    format_list_with_max(node_names, 3)
                ).to.equal('Saurischia Herrerasaurians Theropods');

                done();
            }
            catch(err) {
                done(err);
            }
        }

        tree.loadFromData(example_data);

        var iterator = new LazyIterator(tree);

        iterator.on_must_continue = mustContinue;

        iterator.iterate().then(checkResult);
    });

    it('iterates lazily with lazy loading', function(done) {
        var node_names = [];

        function mustContinue(node, level) {
            node_names.push(node.name);
            return true;
        }

        function checkResult() {
            try {
                expect(node_names.length).to.equal(31);
                expect(node_names).to.contain('Saurischia');

                done();
            }
            catch(err) {
                done(err);
            }
        }

        function testIterate() {
            var iterator = new LazyIterator(tree);

            iterator.on_must_continue = mustContinue;

            iterator.iterate().then(checkResult);
        }

        server = fakeServerWithLoadOnDemand();

        var tree = new Tree();

        tree.loadFromUrl('/examples/data/')
            .then(testIterate);
    });

    it('loads data from an url', function(done) {
        server = fakeServer();

        var tree = new Tree();
        var promise = tree.loadFromUrl('/tree_data');

        promise.then(
            function() {
                try {
                    expect(format_nodes(tree.children)).to.equal('Saurischia Ornithischians');
                    done();
                }
                catch(err) {
                    done(err);
                }
            }
        );
    });

    it('gets the next node', function() {
        var tree = new Tree();
        tree.loadFromData(example_data);

        var node = tree.getNodeByName('Theropods');
        node.open();

        expect(node.getNextNode().name).to.equal('Coelophysoids');
    });

    it("checks if it's the parent of", function() {
        var tree = new Tree();

        var child1 = new Node({name: 'abc', id: 1});
        tree.addChild(child1);

        var child2 = new Node({name: 'def', id: 2});
        child1.addChild(child2);

        expect(tree.isParentOf(child2)).to.equal(true);
    });
});
