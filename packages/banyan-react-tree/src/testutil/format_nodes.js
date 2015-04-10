import {format_list} from "./format";
import {Node} from "../tree_node";


export function format_nodes(nodes) {
    return format_list(
        nodes.map(function(n) {
            return n.name;
        })
    );
}
