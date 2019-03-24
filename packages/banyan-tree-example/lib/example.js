"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const dinosaur_data_1 = require("dinosaur-data");
const immutable_tree_1 = require("@banyan/immutable-tree");
const app_1 = __importDefault(require("./app"));
require("@banyan/react-tree/banyan-react-tree.css");
require("./example.css");
const tree = new immutable_tree_1.Tree([dinosaur_data_1.example_data]).openLevel(1);
react_dom_1.default.render(react_1.default.createElement(app_1.default, { tree: tree }), document.getElementById("tree1"));
//# sourceMappingURL=example.js.map