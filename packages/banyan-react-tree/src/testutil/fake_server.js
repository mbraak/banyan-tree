import sinon from "sinon";

import { example_data, getFirstLevelData, getChildrenOfNode } from "./example_data";


sinon.useFakeXMLHttpRequest();


export function fakeServer(delay: number, mustLoadOnDemand: bool) {
    const server = sinon.fakeServer.create();
    server.autoRespond = true;

    if (delay !== undefined) {
        server.autoRespondAfter = delay;
    }

    server.respondWith(
        (request) => {
            let nodes;

            const regex = new RegExp("^/examples/data/\\?node=(\\d+)$");
            const match = request.url.match(regex);

            if (match) {
                const node_id = parseInt(match[1], 10);
                nodes = getChildrenOfNode(node_id);
            }
            else if (mustLoadOnDemand) {
                nodes = getFirstLevelData();
            }
            else {
                nodes = example_data;
            }

            request.respond(
                200,
                { "Content-Type": "application/json" },
                JSON.stringify(nodes)
            );
        }
    );

    return server;
}

export function fakeServerWithLoadOnDemand(delay: number) {
    return fakeServer(delay, true);
}

export function fakeServerWithError() {
    const server = sinon.fakeServer.create();
    server.autoRespond = true;

    server.respondWith(
        (request) => {
            request.respond(404);
        }
    );

    return server;
}
