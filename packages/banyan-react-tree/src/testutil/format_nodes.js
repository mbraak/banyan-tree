import { format_list } from "./format";


export function format_nodes(nodes) {
    return format_list(
        nodes.map((n) => n.name)
    );
}
