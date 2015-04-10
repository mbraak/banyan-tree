/*
Iterate over all nodes. Load nodes on demand if necessary.

- Return Promise(iteration is done)
*/
export class LazyIterator {
    constructor(root) {
        this.root = root;

        this.on_must_continue = null;
        this.on_before_load = null;
        this.on_visit = null;
        this.must_include_root = false;
        this.visit_count = 0;
    }

    iterate() {
        return this.iterateNode(this.root, 0, this.must_include_root);
    }

    // Must continue iteration?
    mustContinue(node, level) {
        var on_must_continue = this.on_must_continue;

        if (on_must_continue) {
            return on_must_continue(node, level);
        }
        else {
            return true;
        }
    }

    visitNode(node) {
        var on_visit = this.on_visit;

        if (on_visit) {
            on_visit(node);

            this.visit_count += 1;
        }
    }

    // Iterate children of node; return promise
    iterateChildren(node, level) {
        if (!node.children) {
            return Promise.resolve();
        }
        else {
            return Promise.all(
                node.children.map(child => {
                    return this.iterateNode(child, level + 1, true);
                })
            );
        }
    }

    // Iterate node recusively; return promise
    iterateNode(node, level, include_self) {
        // Must continue?
        var must_continue;

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
        else {
            // Yes
            if (!node.load_on_demand) {
                if (include_self) {
                    this.visitNode(node, include_self);
                }

                return this.iterateChildren(node, level);
            }
            else {
                // load node on demand
                var promise = node.loadOnDemand().then(() => {
                    if (include_self) {
                        this.visitNode(node);
                    }

                    return this.iterateChildren(node, level);
                });

                // call on_before_load
                var on_before_load = this.on_before_load;

                if (on_before_load) {
                    on_before_load(node);

                }

                return promise;
            }
        }
    }
}
