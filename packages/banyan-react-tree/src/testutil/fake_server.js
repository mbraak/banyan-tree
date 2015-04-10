import sinon from "sinon";
import {example_data, getFirstLevelData, getChildrenOfNode} from "./example_data";


sinon.useFakeXMLHttpRequest();


export function fakeServer(delay: number, mustLoadOnDemand: bool) {
    var server = sinon.fakeServer.create();
    server.autoRespond = true;

    if (delay !== undefined) {
        server.autoRespondAfter = delay;
    }

    server.respondWith(
        function(request) {
            var nodes;

            var regex = new RegExp("^/examples/data/\\?node=(\\d+)$");
            var match = request.url.match(regex);

            if (match) {
                var node_id = parseInt(match[1]);
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
    var server = sinon.fakeServer.create();
    server.autoRespond = true;

    server.respondWith(
        function(request) {
            request.respond(404);
        }
    );

    return server;
}
