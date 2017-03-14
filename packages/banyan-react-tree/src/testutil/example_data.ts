import { NodeId } from "../immutable_node";

export const test_data = [
    {
        name: "n1",
        id: 1,
        children: [
            { name: "n1a", id: 2 },
            { name: "n1b", id: 3 }
        ]
    },
    {
        name: "n2",
        id: 4,
        children: [
            { name: "n2a", id: 5 },
            { name: "n2b", id: 6 }
        ]
    }
];

export const example_data = [
    {
        name: "Saurischia",
        id: 1,
        children: [
            { name: "Herrerasaurians", id: 2 },
            {
                name: "Theropods",
                id: 3,
                children: [
                    { name: "Coelophysoids", id: 4 },
                    { name: "Ceratosaurians", id: 5 },
                    { name: "Spinosauroids", id: 6 },
                    { name: "Carnosaurians", id: 7 },
                    {
                        name: "Coelurosaurians",
                        id: 8,
                        children: [
                            { name: "Tyrannosauroids", id: 9 },
                            { name: "Ornithomimosaurians", id: 10 },
                            { name: "Therizinosauroids", id: 11 },
                            { name: "Oviraptorosaurians", id: 12 },
                            { name: "Dromaeosaurids", id: 13 },
                            { name: "Troodontids", id: 14 },
                            { name: "Avialans", id: 15 }
                        ]
                    }
                ]
            },
            {
                name: "Sauropodomorphs",
                id: 16,
                children: [
                    { name: "Prosauropods", id: 17 },
                    {
                        name: "Sauropods",
                        id: 18,
                        children: [
                            { name: "Diplodocoids", id: 19 },
                            {
                                name: "Macronarians",
                                id: 20,
                                children: [
                                    { name: "Brachiosaurids", id: 21 },
                                    { name: "Titanosaurians", id: 22 }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        name: "Ornithischians",
        id: 23,
        children: [
            { name: "Heterodontosaurids", id: 24 },
            {
                name: "Thyreophorans",
                id: 25,
                children: [
                    { name: "Ankylosaurians", id: 26 },
                    { name: "Stegosaurians", id: 27 }
                ]
            },
            {
                name: "Ornithopods",
                id: 28,
                children: [
                    { name: "Hadrosaurids", id: 29 }
                ]
            },
            { name: "Pachycephalosaurians", id: 30 },
            { name: "Ceratopsians", id: 31 }
        ]
    }
];

export function getFirstLevelData(param_nodes?: any[]) {
    const nodes = param_nodes || example_data;

    return nodes.map((node: any) => {
        const result: any = {
            name: node.name,
            id: node.id
        };

        if (node.children) {
            result.load_on_demand = true;
        }

        return result;
    });
}

export function getChildrenOfNode(node_id: NodeId): any[] {
    let result: any = null;

    function iterate(nodes: any[]) {
        nodes.forEach((node: any) => {
            if (!result) {
                if (node.id === node_id) {
                    result = node;
                }
                else if (node.children) {
                    iterate(node.children);
                }
            }
        });
    }

    iterate(example_data);

    if (result) {
        return getFirstLevelData(result.children);
    }
    else {
        return [];
    }
}
