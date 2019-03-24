"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_tree_1 = require("@banyan/react-tree");
function renderTitle(node) {
    const name = node.get("name");
    const rank = node.get("rank");
    const url = node.get("url");
    const species_count = node.get("species_count");
    return (react_1.default.createElement("span", null,
        url ? (react_1.default.createElement("a", { href: url, className: "title", target: "_blank", tabIndex: -1 }, name)) : (name),
        react_1.default.createElement("span", { className: "rank" }, rank),
        species_count ? (react_1.default.createElement("span", { className: "species-count" },
            species_count,
            " species")) : null));
}
function App({ tree }) {
    return react_1.default.createElement(react_tree_1.Tree, { tree: tree, renderTitle: renderTitle });
}
exports.default = App;
//# sourceMappingURL=app.js.map