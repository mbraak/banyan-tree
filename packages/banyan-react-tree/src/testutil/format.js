export function format_list(list: Array<string>): string {
    return list.join(" ");
}

export function format_list_with_max(list: Array<string>, max_count:number): string {
    const list_part = [];

    for (let i = 0; i < list.length && i < max_count; i += 1) {
        list_part.push(list[i]);
    }

    return format_list(list_part);
}
