declare module "tree-model" {
    export class Node {
        public id: number;
        public model: any;
        public children: Node[];

        [key: string]: any

        public addChild(child: Node): Node;
        public first(is_node: (node: Node) => boolean): Node | null;
        public drop(): Node;
        public isRoot(): boolean;
        public hasChildren(): boolean;
    }

    export default class TreeModel {
        public parse(model: any): Node;
    }
}
