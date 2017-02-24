import { renderToStaticMarkup } from "react-dom/server";
import cheerio from "cheerio";

export const render = (element: React.ReactElement<any>): Cheerio => (
    cheerio(renderToStaticMarkup(element))
);

export function treeElementToString(el: Cheerio): string {
    return elementsToString(el.children("li"));
}

function elementToString(el: Cheerio): string {
    const ul = el.children();

    const children = ul.children("li");
    const has_children = children.length !== 0;

    const title = el.children("div").children(".banyan-title").text();

    if (!has_children) {
        return title;
    } else {
        return `${title}(${elementsToString(children)})`;
    }
}

function elementsToString(els: Cheerio): string {
    return els.map(
        (i, el) => elementToString(cheerio(el))
    )
    .get().join(" ");
}
