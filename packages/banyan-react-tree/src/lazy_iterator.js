/* @flow */
import { Node } from "./tree_node";


/*
Iterate over all nodes. Load nodes on demand if necessary.

- Return Promise(iteration is done)
*/
export class LazyIterator {
    root: Node;
    on_must_continue: ?Function;
    on_before_load: ?Function;
    on_visit: ?Function;
    must_include_root: bool;
    visit_count: number;

    constructor(root: Node) {
        this.root = root;

        this.on_must_continue = null;
        this.on_before_load = null;
        this.on_visit = null;
        this.must_include_root = false;
        this.visit_count = 0;
    }

    iterate(): Promise<null> {
        return this.iterateNode(this.root, 0, this.must_include_root);
    }

    // Must continue iteration?
    mustContinue(node: Node, level: number): bool {
        const on_must_continue = this.on_must_continue;

        if (on_must_continue) {
            return on_must_continue(node, level);
        }
        else {
            return true;
        }
    }

    visitNode(node: Node) {
        const on_visit = this.on_visit;

        if (on_visit) {
            on_visit(node);

            this.visit_count += 1;
        }
    }

    // Iterate children of node; return promise
    iterateChildren(node: Node, level: number): Promise<*> {
        if (!node.children) {
            return Promise.resolve();
        }
        else {
            return Promise.all(
                node.children.map(
                    child => this.iterateNode(child, level + 1, true)
                )
            );
        }
    }

    // Iterate node recusively; return promise
    iterateNode(node: Node, level: number, include_self: bool): Promise<> {
        // Must continue?
        let must_continue;

        if (!include_self) {
            must_continue = true;
        }
        else {
            must_continue = this.mustContinue(node, level);
        }

        if (!must_continue) {
            // No
            return Promise.resolve();
        }
        // Yes
        else if (!node.load_on_demand) {
            if (include_self) {
                this.visitNode(node, include_self);
            }

            return this.iterateChildren(node, level);
        }
        else {
            // load node on demand
            const promise = node.loadOnDemand().then(() => {
                if (include_self) {
                    this.visitNode(node);
                }

                return this.iterateChildren(node, level);
            });

            // call on_before_load
            const on_before_load = this.on_before_load;

            if (on_before_load) {
                on_before_load(node);
            }

            return promise;
        }
    }
}
